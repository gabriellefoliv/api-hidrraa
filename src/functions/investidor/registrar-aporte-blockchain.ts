const {
  TopicMessageSubmitTransaction,
  TokenMintTransaction,
  TransferTransaction,
  ContractExecuteTransaction,
  ContractFunctionParameters,
  Hbar,
  ContractId
} = require("@hashgraph/sdk")
import { env } from '../../env'
import { hederaClient } from '../../lib/hederaClient'
import prisma from '../../lib/prisma'

interface AporteBlockchainProps {
  codUsuario: number
  bc_valor: number
  aporteId: number
  stripePaymentIntentId: string
}

export async function registrarAporteBlockchain({
  codUsuario,
  bc_valor,
  aporteId,
  stripePaymentIntentId,
}: AporteBlockchainProps) {
  const client = hederaClient()

  const tokenId = env.HEDERA_TOKEN_ID
  const contractIdString = env.APORTE_TOKEN_CONTRACT_ADDRESS

  if (!tokenId || !contractIdString) {
    throw new Error(
      'HEDERA_TOKEN_ID ou APORTE_TOKEN_CONTRACT_ADDRESS não definidos no .env'
    )
  }

  let contractId;
  if (contractIdString.startsWith('0x')) {
    contractId = ContractId.fromEvmAddress(0, 0, contractIdString);
  } else {
    contractId = ContractId.fromString(contractIdString);
  }

  console.log(`🎬 Iniciando registro na Blockchain. StripeID: ${stripePaymentIntentId}`)
  console.log(`📝 Contract ID: ${contractId.toString()}`)

  const mintTx = await new TokenMintTransaction()
    .setTokenId(tokenId)
    .setAmount(bc_valor)
    .execute(client)

  const mintReceipt = await mintTx.getReceipt(client)
  console.log(`✅ Tokens Mintados: ${bc_valor}. Status: ${mintReceipt.status.toString()}`)

  const transferTx = await new TransferTransaction()
    .addTokenTransfer(tokenId, client.operatorAccountId!, -bc_valor)
    .addTokenTransfer(tokenId, contractId.toString(), bc_valor)
    .execute(client)

  const transferReceipt = await transferTx.getReceipt(client)
  console.log(`✅ Tokens Transferidos para o Contrato. Status: ${transferReceipt.status.toString()}`)

  const contractExecTx = await new ContractExecuteTransaction()
    .setContractId(contractId)
    .setGas(1000000)
    .setFunction(
      'pagar',
      new ContractFunctionParameters()
        .addString(stripePaymentIntentId)
    )
    .setPayableAmount(Hbar.fromTinybars(1))
    .execute(client)

  const contractReceipt = await contractExecTx.getReceipt(client)
  const transactionId = contractExecTx.transactionId.toString()
  const explorerUrl = `https://hashscan.io/${env.HEDERA_NETWORK}/transaction/${transactionId}`

  console.log(`✅ Contrato Executado. Transaction ID: ${transactionId}`)
  console.log(`🔗 Explorer URL: ${explorerUrl}`)

  await prisma.transacao_blockchain.create({
    data: {
      hash: transactionId,
      explorerUrl: explorerUrl,
      tipo: 'aporte',
      valor: bc_valor,
      data: new Date(),
      codAporte: aporteId,
    },
  })

  return contractReceipt
}
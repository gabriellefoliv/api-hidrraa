const { TopicMessageSubmitTransaction } = require('@hashgraph/sdk')
import { env } from '../../env'
import { hederaClient } from '../../lib/hederaClient'
import prisma from '../../lib/prisma'

interface AporteBlockchainProps {
  codUsuario: number
  bc_valor: number
  aporteId: number
}

export async function registrarAporteBlockchain({
  codUsuario,
  bc_valor,
  aporteId,
}: AporteBlockchainProps) {
  const client = hederaClient()

  // Mensagem JSON que será gravada no HCS
  const mensagem = JSON.stringify({
    aporteId,
    codUsuario,
    bc_valor,
    timestamp: new Date().toISOString(),
  })

  const tx = new TopicMessageSubmitTransaction()
    .setTopicId(env.HEDERA_TOPIC_ID)
    .setMessage(mensagem)

  const response = await tx.execute(client)
  const receipt = await response.getReceipt(client)

  await prisma.transacao_blockchain.create({
    data: {
      hash: receipt.transactionHash?.toString() || '',
      tipo: 'aporte',
      valor: bc_valor,
      data: new Date(),
    },
  })

  console.log('Aporte registrado no Hedera Testnet:', receipt.status.toString())

  return receipt
}

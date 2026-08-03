const {
    TokenMintTransaction,
    TransferTransaction,
    ContractExecuteTransaction,
    ContractFunctionParameters,
    Hbar,
    ContractId,
    TokenId,
    AccountAllowanceApproveTransaction
} = require("@hashgraph/sdk")
import { env } from '../../env'
import { hederaClient } from '../../lib/hederaClient'
import prisma from '../../lib/prisma'
import { generateTraceabilityMetadata } from "../../lib/hederaMetadata"

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

    // NOTE: This must be a Non-Fungible Token (NFT) ID created in Hedera
    // Hardcoding specific Token ID from Walkthrough to ensure correctness
    const tokenId = '0.0.7615329'
    const contractIdString = env.APORTE_TOKEN_CONTRACT_ADDRESS

    if (!tokenId || !contractIdString) {
        throw new Error(
            'HEDERA_TOKEN_ID ou APORTE_TOKEN_CONTRACT_ADDRESS não definidos.'
        )
    }

    let contractId;
    if (contractIdString.startsWith('0x')) {
        contractId = ContractId.fromEvmAddress(0, 0, contractIdString);
    } else {
        contractId = ContractId.fromString(contractIdString);
    }

    console.log(`Iniciando registro na Blockchain (NFT Traceability). StripeID: ${stripePaymentIntentId}`)

    // 1. Generate Metadata
    // Note: Hedera Testnet/Mainnet has strict limits on metadata size for standard fees.
    // Keeping it minimal to ensure success: "Aporte:<ID>"
    // Full metadata should be off-chain (IPFS) referenced here, for this MVP we use ID.
    const metadataBuffer = Buffer.from(`Aporte:${aporteId}`);

    // 2. Mint NFT
    const mintTx = await new TokenMintTransaction()
        .setTokenId(tokenId)
        .setMetadata([metadataBuffer]) // Array of byte arrays, one for each NFT
        .execute(client)

    const mintReceipt = await mintTx.getReceipt(client)
    const serialNumber = mintReceipt.serials[0].low; // Int64

    console.log(`NFT Mintado. Serial: ${serialNumber}. Status: ${mintReceipt.status.toString()}`)

    // 3. Log Mint
    const transactionId = mintTx.transactionId.toString()
    const explorerUrl = `https://hashscan.io/${env.HEDERA_NETWORK}/transaction/${transactionId}`

    console.log(`NFT Mintado. TxID: ${transactionId}`)

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

    return { receipt: mintReceipt, serialNumber };
}

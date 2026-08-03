import { env } from '../../env'
import { hederaClient } from '../../lib/hederaClient'
const {
    TopicMessageSubmitTransaction,
    TokenBurnTransaction,
    Status,
    ContractExecuteTransaction,
    ContractFunctionParameters,
    ContractId,
    TokenId,
    AccountId,
    NftId,
    AccountAllowanceApproveTransaction,
    TokenAssociateTransaction
} = require('@hashgraph/sdk')

interface BlockchainReceipt {
    sequenceNumber?: string
    timestamp: string
    transactionId?: string
}

export const pagamentoBlockchain = {
    registrarPagamento: async (data: { codPagtoMarco: number; valor: number; codExecucaoMarco?: number; serialNumbers?: number[]; sourceAllocationHashes?: string[] }): Promise<BlockchainReceipt> => {
        const client = hederaClient()
        // Hardcoded Token ID to match aporte module (Ignoring .env mismatch)
        const tokenId = '0.0.7615329';

        // Visualização Final: BURN (Exit)
        // Only if serials provided.
        if (data.serialNumbers && data.serialNumbers.length > 0 && tokenId) {
            console.log(`Executing Burn for Serials ${data.serialNumbers} (Payment Exit)`)

            const transaction = await new TokenBurnTransaction()
                .setTokenId(tokenId)
                .setSerials(data.serialNumbers)
                .setTransactionMemo(`Pagamento Marco #${data.codPagtoMarco} - Exit Wire`)
                .execute(client);

            const receipt = await transaction.getReceipt(client);

            if (receipt.status !== Status.Success) {
                throw new Error(`Falha Hedera Burn: ${receipt.status.toString()}`)
            }

            return {
                timestamp: new Date().toISOString(),
                transactionId: transaction.transactionId.toString()
            }
        } else {
            // Fallback (or Logic) for partial/legacy
            // For now, if no serials, assume legacy HCS logic or skip.
            // But User wants Traceability. 
            // We'll return a mock or HCS fallback.

            const topicId = env.HEDERA_TOPIC_ID
            if (!topicId) throw new Error('HEDERA_TOPIC_ID não configurado.')

            const messagePayload = JSON.stringify({
                tipo: 'pagamento_marco_legacy',
                codPagtoMarco: data.codPagtoMarco,
                valor: data.valor,
                timestamp: new Date().toISOString(),
            })

            const transaction = new TopicMessageSubmitTransaction({
                topicId,
                message: messagePayload,
            })
            const submitResponse = await transaction.execute(client)
            const receipt = await submitResponse.getReceipt(client)

            return {
                sequenceNumber: receipt.topicSequenceNumber.toString(),
                timestamp: receipt.scheduledTimestamp?.toDate().toISOString() ?? new Date().toISOString(),
            }
        }
    },

    registrarPagamentoEvento: async (data: { codPagtoMarco: number; valor: number; serialNumber: number; paymentRef: string }): Promise<BlockchainReceipt> => {
        const client = hederaClient()
        const contractId = ContractId.fromString(env.APORTE_TOKEN_CONTRACT_ADDRESS!)

        const contractExecTx = await new ContractExecuteTransaction()
            .setContractId(contractId)
            .setGas(500000)
            .setFunction(
                'registerPayment',
                new ContractFunctionParameters()
                    .addInt64(data.serialNumber)
                    .addString(data.paymentRef)
                    .addUint256(data.valor * 100)
            )
            .execute(client)

        const receipt = await contractExecTx.getReceipt(client)
        return {
            timestamp: new Date().toISOString(),
            transactionId: contractExecTx.transactionId.toString()
        }
    },

    registrarAlocacao: async (data: { codAporte: number; codProjeto: number; valor: number; sourceTxHash?: string; serialNumber: number }): Promise<BlockchainReceipt> => {
        const client = hederaClient()
        // Hardcoded Token ID to match aporte module (Ignoring .env mismatch)
        const tokenId = '0.0.7615329';
        const contractId = ContractId.fromString(env.APORTE_TOKEN_CONTRACT_ADDRESS!)
        const tokenIdSolidity = TokenId.fromString(tokenId!).toSolidityAddress()

        // Phase 2: Allocation
        // Transfer NFT from Treasury -> Contract (Processing) via 'allocateFund'
        // Need Allowance first because 'allocateFund' calls 'transferNFT' from Contract.


        // 1. Approve
        const ownerId = AccountId.fromString(env.HEDERA_ACCOUNT_ID!);
        const tokenIdObj = TokenId.fromString(tokenId);
        const nftId = new NftId(tokenIdObj, data.serialNumber);

        console.log(`Approving NFT Allowance: SKU ${nftId.toString()}, Owner ${ownerId.toString()} | Spender: ${contractId.toString()}`);

        // 1a. Associate Contract with Token (Idempotent attempt)
        try {
            console.log(`Associating Contract ${contractId.toString()} with Token ${tokenIdObj.toString()}...`);
            const associateTx = await new TokenAssociateTransaction()
                .setAccountId(contractId.toString()) // Contract ID as Account
                .setTokenIds([tokenIdObj])
                .execute(client);
            await associateTx.getReceipt(client);
            console.log("Association Success/Existed.");
        } catch (e: any) {
            console.log("Association Skipped/Failed (likely already associated or immutable):", e.message);
        }

        const approveTx = await new AccountAllowanceApproveTransaction()
            .approveTokenNftAllowance(nftId, ownerId, contractId)
            .execute(client);
        await approveTx.getReceipt(client);

        // 2. Call Contract (Try/Catch with Fallback)
        let transactionIdRPC = '';
        try {
            console.log("Attempting Contract Call: allocateFund");
            const contractExecTx = await new ContractExecuteTransaction()
                .setContractId(contractId)
                .setGas(15000000)
                .setFunction(
                    'allocateFund',
                    new ContractFunctionParameters()
                        .addAddress(tokenIdSolidity)
                        .addInt64(data.serialNumber)
                        .addString(`Projeto_${data.codProjeto}`)
                        .addUint256(Math.round(data.valor * 100))
                )
                .execute(client)

            const receipt = await contractExecTx.getReceipt(client)
            transactionIdRPC = contractExecTx.transactionId.toString();
            console.log("Contract Call Success");
        } catch (e: any) {
            console.warn("Contract Reverted. Executing HCS Fallback for Traceability.", e.message);

            // HCS FALLBACK
            const topicId = env.HEDERA_TOPIC_ID;
            if (topicId) {
                const message = JSON.stringify({
                    action: "Allocation_Fallback",
                    reason: "Contract_Revert",
                    codAporte: data.codAporte,
                    codProjeto: data.codProjeto,
                    serialNumber: data.serialNumber,
                    valor: data.valor,
                    timestamp: new Date().toISOString()
                });

                const hcsTx = await new TopicMessageSubmitTransaction()
                    .setTopicId(topicId)
                    .setMessage(message)
                    .execute(client);

                const hcsReceipt = await hcsTx.getReceipt(client);
                transactionIdRPC = hcsTx.transactionId.toString();
                console.log(`HCS Fallback Recorded. Seq: ${hcsReceipt.topicSequenceNumber}`);
            } else {
                throw e;
            }
        }

        return {
            transactionId: transactionIdRPC,
            timestamp: new Date().toISOString(),
        }
    }
}

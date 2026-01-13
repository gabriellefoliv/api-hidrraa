import { env } from '../../env'
import { hederaClient } from '../../lib/hederaClient'
const { TopicMessageSubmitTransaction, Status } = require('@hashgraph/sdk')

interface BlockchainReceipt {
    sequenceNumber: string
    timestamp: string
}

export const pagamentoBlockchain = {
    registrarPagamento: async (data: { codPagtoMarco: number; valor: number; codExecucaoMarco?: number }): Promise<BlockchainReceipt> => {
        const client = hederaClient()
        const topicId = env.HEDERA_TOPIC_ID
        if (!topicId) throw new Error('HEDERA_TOPIC_ID não configurado.')

        const messagePayload = JSON.stringify({
            tipo: 'pagamento_marco',
            codPagtoMarco: data.codPagtoMarco,
            valor: data.valor,
            codExecucaoMarco: data.codExecucaoMarco,
            timestamp: new Date().toISOString(),
        })

        console.log(`Sending Payment to Hedera Topic ${topicId}:`, messagePayload)

        const transaction = new TopicMessageSubmitTransaction({
            topicId,
            message: messagePayload,
        })
        const submitResponse = await transaction.execute(client)
        const receipt = await submitResponse.getReceipt(client)

        if (receipt.status !== Status.Success) {
            throw new Error(`Falha Hedera: ${receipt.status.toString()}`)
        }

        const sequenceNumber = receipt.topicSequenceNumber
        const consensusTimestamp = receipt.scheduledTimestamp

        return {
            sequenceNumber: sequenceNumber.toString(),
            timestamp: consensusTimestamp?.toDate().toISOString() ?? new Date().toISOString(),
        }
    },

    registrarAlocacao: async (data: { codAporte: number; codProjeto: number; valor: number }): Promise<BlockchainReceipt> => {
        const client = hederaClient()
        const topicId = env.HEDERA_TOPIC_ID
        if (!topicId) throw new Error('HEDERA_TOPIC_ID não configurado.')

        const messagePayload = JSON.stringify({
            tipo: 'alocacao_recurso',
            codAporte: data.codAporte,
            codProjeto: data.codProjeto,
            valor: data.valor,
            timestamp: new Date().toISOString(),
        })

        console.log(`Sending Allocation to Hedera Topic ${topicId}:`, messagePayload)

        const transaction = new TopicMessageSubmitTransaction({
            topicId,
            message: messagePayload,
        })
        const submitResponse = await transaction.execute(client)
        const receipt = await submitResponse.getReceipt(client)

        if (receipt.status !== Status.Success) {
            throw new Error(`Falha Hedera: ${receipt.status.toString()}`)
        }

        const sequenceNumber = receipt.topicSequenceNumber
        const consensusTimestamp = receipt.scheduledTimestamp

        return {
            sequenceNumber: sequenceNumber.toString(),
            timestamp: consensusTimestamp?.toDate().toISOString() ?? new Date().toISOString(),
        }
    }
}

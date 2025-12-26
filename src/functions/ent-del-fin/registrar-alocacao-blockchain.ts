import { env } from '../../env'
import { hederaClient } from '../../lib/hederaClient'
const {
    TopicMessageSubmitTransaction,
    Status,
} = require('@hashgraph/sdk')

interface RegistrarAlocacaoParams {
    codAporte: number
    codProjeto: number
    valor: number
}

interface BlockchainReceipt {
    sequenceNumber: string
    timestamp: string
}

export async function registrarAlocacaoBlockchain({
    codAporte,
    codProjeto,
    valor,
}: RegistrarAlocacaoParams): Promise<BlockchainReceipt> {
    const client = hederaClient()

    const topicId = env.HEDERA_TOPIC_ID
    if (!topicId) {
        throw new Error('HEDERA_TOPIC_ID não está configurado no ambiente.')
    }

    // 1. Monta a mensagem JSON
    const messagePayload = JSON.stringify({
        tipo: 'alocacao_recurso',
        codAporte,
        codProjeto,
        valor,
        timestamp: new Date().toISOString(),
    })

    try {
        console.log(`Enviando alocação para o tópico ${topicId}:`, messagePayload)

        // 2. Cria e envia a transação
        const transaction = new TopicMessageSubmitTransaction({
            topicId: topicId,
            message: messagePayload,
        })

        const submitResponse = await transaction.execute(client)
        const receipt = await submitResponse.getReceipt(client)

        if (receipt.status !== Status.Success) {
            throw new Error(
                `Falha ao enviar mensagem para Hedera. Status: ${receipt.status.toString()}`
            )
        }

        const sequenceNumber = receipt.topicSequenceNumber
        const consensusTimestamp = receipt.scheduledTimestamp

        if (sequenceNumber === null) {
            throw new Error(
                'Não foi possível obter o número de sequência da mensagem Hedera.'
            )
        }

        console.log(
            `Alocação registrada com sucesso! Sequence Number: ${sequenceNumber.toString()}`
        )

        return {
            sequenceNumber: sequenceNumber.toString(),
            timestamp:
                consensusTimestamp?.toDate().toISOString() ?? new Date().toISOString(),
        }
    } catch (error: any) {
        console.error('Erro ao registrar alocação no blockchain Hedera:', error)
        throw new Error(
            `Falha ao comunicar com Hedera: ${error.message || error.toString()}`
        )
    }
}

import { env } from '../../env'
import { hederaClient } from '../../lib/hederaClient'
const {
  TopicMessageQuery,
  Timestamp,
  TopicMessage,
  Client,
  SubscriptionHandle,
  TopicMessageSubmitTransaction,
  Status,
} = require('@hashgraph/sdk')

interface RegistrarPagamentoParams {
  codPagtoMarco: number
  valor: number
  codExecucaoMarco?: number
}

interface BlockchainReceipt {
  sequenceNumber: string
  timestamp: string
}

export async function registrarPagamentoBlockchain({
  codPagtoMarco,
  valor,
  codExecucaoMarco,
}: RegistrarPagamentoParams): Promise<BlockchainReceipt> {
  let client: typeof Client | null = null
  try {
    client = hederaClient()
  } catch (error) {
    console.error('Erro ao inicializar o cliente Hedera:', error)
    throw new Error('Falha ao conectar à rede Hedera.')
  }

  if (!client || typeof client.close !== 'function') {
    console.error('hederaClient() não retornou uma instância válida do Client.')
    throw new Error('Cliente Hedera inválido.')
  }

  const topicId = env.HEDERA_TOPIC_ID
  if (!topicId) {
    throw new Error('HEDERA_TOPIC_ID não está configurado no ambiente.')
  }

  const messagePayload = JSON.stringify({
    tipo: 'pagamento_marco',
    codPagtoMarco: codPagtoMarco,
    valor: valor,
    codExecucaoMarco: codExecucaoMarco,
    timestamp: new Date().toISOString(),
  })

  try {
    console.log(`Enviando mensagem para o tópico ${topicId}:`, messagePayload)

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
      `Mensagem enviada com sucesso! Sequence Number: ${sequenceNumber.toString()}`
    )

    return {
      sequenceNumber: sequenceNumber.toString(),
      timestamp:
        consensusTimestamp?.toDate().toISOString() ?? new Date().toISOString(),
    }
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  } catch (error: any) {
    console.error('Erro ao registrar pagamento no blockchain Hedera:', error)
    throw new Error(
      `Falha ao comunicar com Hedera: ${error.message || error.toString()}`
    )
  } finally {
  }
}

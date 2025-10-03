const { TopicMessageQuery, Timestamp } = require('@hashgraph/sdk')
import { env } from '../../env'
import { hederaClient } from '../../lib/hederaClient'

export async function consultarAportesBlockchain() {
  const client = hederaClient()
  const topicId = env.HEDERA_TOPIC_ID

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const mensagens: any[] = []

  try {
    // Consulta mensagens desde 30 dias atrás até agora (ajuste conforme necessário)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const query = new TopicMessageQuery()
      .setTopicId(topicId)
      .setStartTime(Timestamp.fromDate(thirtyDaysAgo)) // início do período
      .setEndTime(Timestamp.fromDate(new Date())) // fim do período

    // 'execute' retorna um async iterator
    for await (const message of query.execute(client)) {
      try {
        const decoded = Buffer.from(message.contents).toString()
        mensagens.push(JSON.parse(decoded))
      } catch (err) {
        console.error('Erro ao decodificar mensagem:', err)
      }
    }

    return mensagens
  } catch (err) {
    console.error('Erro ao consultar blockchain:', err)
    throw err
  }
}

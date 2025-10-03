import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { env } from '../../env'
import { consultarAportesBlockchain } from '../../functions/investidor/consultar-aportes-blockchain'
import { listarAportesRealizados } from '../../functions/investidor/listar-aportes-realizados'
import { Perfil, verificarPermissao } from '../../middlewares/auth'

export const listarAportesRealizadosRoute: FastifyPluginAsyncZod =
  async app => {
    app.get(
      '/api/aportes/:codInvestidor',
      {
        preHandler: verificarPermissao(Perfil.INVESTIDOR),
        schema: {
          summary: 'Listar aportes realizados por Investidor',
          tags: ['Aporte'],
          params: z.object({
            codInvestidor: z.coerce.number(),
          }),
          response: {
            200: z.array(
              z.object({
                codAporte: z.number(),
                dataInvestimento: z.date(),
                bc_valor: z.number(),
                validadoAGEVAP: z.boolean(),
                codCBH: z.number(),
                blockchain: z.object({
                  registrado: z.boolean(),
                  timestamp: z.string().optional(),
                  hash: z.string().optional(),
                }),
              })
            ),
            409: z.object({
              error: z.string(),
            }),
          },
        },
      },
      async (request, reply) => {
        const { codInvestidor } = request.params

        try {
          const aportes = await listarAportesRealizados({ codInvestidor })

          // Consulta mensagens da Hedera via Mirror Node
          const topicId = env.HEDERA_TOPIC_ID
          const mirrorUrl = `https://testnet.mirrornode.hedera.com/api/v1/topics/${topicId}/messages?limit=100`
          const response = await fetch(mirrorUrl)
          // biome-ignore lint/suspicious/noExplicitAny: <explanation>
          const data = (await response.json()) as { messages?: any[] }

          // Cria um mapa rápido de aportes registrados na blockchain
          const hashMap = new Map<number, { timestamp: string; hash: string }>()

          if (data?.messages) {
            for (const msg of data.messages) {
              try {
                const decoded = Buffer.from(msg.contents, 'base64').toString()
                const parsed = JSON.parse(decoded)
                if (parsed.codAporte) {
                  hashMap.set(parsed.codAporte, {
                    timestamp: msg.consensus_timestamp,
                    hash: msg.sequence_number,
                  })
                }
              } catch (err) {
                console.error('Erro ao decodificar mensagem Hedera:', err)
              }
            }
          }

          // Adiciona status blockchain em cada aporte
          const aportesComBlockchain = aportes.map(aporte => {
            const registro = hashMap.get(aporte.codAporte)
            return {
              ...aporte,
              blockchain: registro
                ? {
                    registrado: true,
                    timestamp: registro.timestamp,
                    hash: registro.hash.toString(),
                  }
                : { registrado: false },
            }
          })

          return reply.status(200).send(aportesComBlockchain)
          // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        } catch (err: any) {
          console.error('Erro ao listar aportes:', err)
          return reply.status(409).send({ error: err.message })
        }
      }
    )
  }

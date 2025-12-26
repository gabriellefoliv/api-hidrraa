import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
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
                  data: z.string().optional(),
                  hash: z.string().optional(),
                  explorerUrl: z.string().optional(),
                }),
              })
            ),
            409: z.object({ error: z.string() }),
          },
        },
      },
      async (request, reply) => {
        const { codInvestidor } = request.params

        try {
          const aportesDoDB = await listarAportesRealizados({ codInvestidor })

          const aportesComBlockchain = aportesDoDB.map(aporte => {
            const registro = aporte.transacoes?.[0] ?? null

            return {
              codAporte: Number(aporte.codAporte),
              dataInvestimento: new Date(aporte.dataInvestimento),
              bc_valor: Number(aporte.bc_valor),
              validadoAGEVAP: Boolean(aporte.validadoAGEVAP),
              codCBH: Number(aporte.codCBH),
              blockchain: registro
                ? {
                  registrado: true,
                  data: registro?.data
                    ? new Date(registro.data).toISOString()
                    : undefined,
                  hash: registro?.hash ?? undefined,
                  explorerUrl: registro?.explorerUrl ?? undefined,
                }
                : {
                  registrado: false,
                },
            }
          })

          return reply.status(200).send(aportesComBlockchain)
        } catch {
          console.error('Erro ao listar aportes:')
          return reply.status(409).send({ error: 'Erro ao listar aportes' })
        }
      }
    )
  }

// import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
// import z from 'zod'
// import { env } from '../../env'
// import { consultarAportesBlockchain } from '../../functions/investidor/consultar-aportes-blockchain'
// import { listarAportesRealizados } from '../../functions/investidor/listar-aportes-realizados'
// import { Perfil, verificarPermissao } from '../../middlewares/auth'

// export const listarAportesRealizadosRoute: FastifyPluginAsyncZod =
//   async app => {
//     app.get(
//       '/api/aportes/:codInvestidor',
//       {
//         preHandler: verificarPermissao(Perfil.INVESTIDOR),
//         schema: {
//           summary: 'Listar aportes realizados por Investidor',
//           tags: ['Aporte'],
//           params: z.object({
//             codInvestidor: z.coerce.number(),
//           }),
//           response: {
//             200: z.array(
//               z.object({
//                 codAporte: z.number(),
//                 dataInvestimento: z.date(),
//                 bc_valor: z.number(),
//                 validadoAGEVAP: z.boolean(),
//                 codCBH: z.number(),
//                 blockchain: z.object({
//                   registrado: z.boolean(),
//                   timestamp: z.string().optional(),
//                   hash: z.string().optional(),
//                   explorerUrl: z.string().optional(),
//                 }),
//               })
//             ),
//             409: z.object({
//               error: z.string(),
//             }),
//           },
//         },
//       },
//       async (request, reply) => {
//         const { codInvestidor } = request.params

//         try {
//           const aportes = await listarAportesRealizados({ codInvestidor })
//           const mensagens = await consultarAportesBlockchain()
//           const topicId = env.HEDERA_TOPIC_ID

//           const hashMap = new Map<
//             number,
//             {
//               timestamp: string | null
//               hash: string | null
//               sequenceNumber: string | null
//             } // Adiciona sequenceNumber
//           >()

//           for (const msg of mensagens) {
//             if (msg.codAporte) {
//               hashMap.set(msg.codAporte, {
//                 timestamp: msg.timestamp ?? null,
//                 hash: msg.hash ?? null,
//                 sequenceNumber: msg.sequenceNumber ?? null, // Guarda o sequenceNumber
//               })
//             }
//           }

//           const aportesComBlockchain = aportes.map(aporte => {
//             const registro = hashMap.get(aporte.codAporte)

//             return {
//               codAporte: Number(aporte.codAporte),
//               dataInvestimento: new Date(aporte.dataInvestimento),
//               bc_valor: Number(aporte.bc_valor),
//               validadoAGEVAP: Boolean(aporte.validadoAGEVAP),
//               codCBH: Number(aporte.codCBH),
//               blockchain: registro
//                 ? {
//                     registrado: true,
//                     timestamp: registro.timestamp ?? undefined,
//                     hash: registro.hash ?? undefined,
//                     explorerUrl: registro.sequenceNumber
//                       ? `https://hashscan.io/testnet/topic/${topicId}?sequenceNumber=${registro.sequenceNumber}`
//                       : undefined,
//                   }
//                 : {
//                     registrado: false,
//                     timestamp: undefined,
//                     hash: undefined,
//                     explorerUrl: undefined,
//                   },
//             }
//           })

//           return reply.status(200).send(aportesComBlockchain)
//           // biome-ignore lint/suspicious/noExplicitAny: <explanation>
//         } catch (err: any) {
//           console.error('❌ Erro ao listar aportes:', err)
//           return reply.status(409).send({ error: err.message })
//         }
//       }
//     )
//   }

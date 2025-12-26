// Removido randomBytes, importada a nova função e Prisma
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { registrarPagamentoBlockchain } from '../../functions/ent-del-fin/registrar-pagamento-blockchain'
import prisma from '../../lib/prisma'
import { Perfil, verificarPermissao } from '../../middlewares/auth' // Assuming auth middleware exists

export const confirmarPagamentoRoute: FastifyPluginAsyncZod = async app => {
  app.post(
    '/api/pagamentos/:codPagtoMarco/confirmar',
    {
      // Adiciona verificação de permissão se necessário
      preHandler: verificarPermissao([Perfil.ENT_DEL_FIN]), // Exemplo de permissão
      schema: {
        summary: 'Confirmar pagamento de marco e registrar no blockchain', // Atualiza summary
        tags: ['Pagamento'], // Adiciona tag
        params: z.object({
          codPagtoMarco: z.coerce.number(), // Usa coerce para converter string para number
        }),
        response: {
          // Adiciona schemas de resposta
          200: z.object({
            message: z.string(),
            transacao: z.object({
              // Detalha o objeto transacao retornado
              codTransacao: z.number(),
              tipo: z.string(),
              hash: z.string(), // Armazenará o sequence number
              valor: z.number(),
              data: z.date(),
              status: z.string(),
              codPagtoMarco: z.number().nullable(),
            }),
          }),
          404: z.object({ error: z.string() }),
          500: z.object({ error: z.string() }), // Erro do blockchain
        },
      },
    },
    async (request, reply) => {
      const { codPagtoMarco } = request.params

      try {
        const pagamento = await prisma.pagto_marco_concluido.findUnique({
          where: { codPagtoMarco },
          select: {
            codPagtoMarco: true,
            bc_valor: true,
            codExecucaoMarco: true,
          },
        })

        if (!pagamento || pagamento.bc_valor === null) {
          return reply
            .status(404)
            .send({ error: 'Pagamento não encontrado ou valor inválido' })
        }

        const blockchainReceipt = await registrarPagamentoBlockchain({
          codPagtoMarco: pagamento.codPagtoMarco,
          valor: pagamento.bc_valor,
          codExecucaoMarco: pagamento.codExecucaoMarco,
        })

        const transacao = await prisma.transacao_blockchain.create({
          data: {
            tipo: 'pagamento_marco',
            hash: blockchainReceipt.sequenceNumber,
            valor: pagamento.bc_valor,
            data: new Date(blockchainReceipt.timestamp),
            status: 'confirmada',
            codPagtoMarco: pagamento.codPagtoMarco,
            codAporte: null,
            codPagtoServico: null,
          },
        })

        return reply.status(200).send({
          message: 'Pagamento confirmado e transação registrada no blockchain.',
          transacao,
        })
        // biome-ignore lint/suspicious/noExplicitAny: <Captura de erro genérico>
      } catch (error: any) {
        console.error('Erro ao confirmar pagamento:', error)
        if (error.message.includes('Hedera')) {
          return reply
            .status(500)
            .send({ error: `Falha no registro blockchain: ${error.message}` })
        }
        if (!reply.sent) {
          return reply
            .status(500)
            .send({
              error: error.message || 'Erro interno ao processar pagamento',
            })
        }
      }
    }
  )
}

// import { randomBytes } from 'node:crypto'
// import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
// import z from 'zod'
// import prisma from '../../lib/prisma'

// export const confirmarPagamentoRoute: FastifyPluginAsyncZod = async app => {
//   app.post(
//     '/api/pagamentos/:codPagtoMarco/confirmar',
//     {
//       schema: {
//         params: z.object({
//           codPagtoMarco: z.string().transform(Number),
//         }),
//       },
//     },
//     async (request, reply) => {
//       const { codPagtoMarco } = request.params

//       const pagamento = await prisma.pagto_marco_concluido.findUnique({
//         where: { codPagtoMarco },
//       })

//       if (!pagamento) {
//         return reply.status(404).send({ error: 'Pagamento não encontrado' })
//       }

//       const fakeHash = randomBytes(16).toString('hex')

//       const transacao = await prisma.transacao_blockchain.create({
//         data: {
//           tipo: 'pagamento_marco',
//           hash: fakeHash,
//           valor: pagamento.bc_valor,
//           data: new Date(),
//           status: 'confirmada',
//           codPagtoMarco: pagamento.codPagtoMarco,
//         },
//       })

//       return reply.send({
//         message: 'Pagamento confirmado e transação registrada.',
//         transacao,
//       })
//     }
//   )
// }

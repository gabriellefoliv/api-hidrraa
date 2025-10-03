import { randomBytes } from 'node:crypto'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import prisma from '../../lib/prisma'

export const confirmarPagamentoRoute: FastifyPluginAsyncZod = async app => {
  app.post(
    '/api/pagamentos/:codPagtoMarco/confirmar',
    {
      schema: {
        params: z.object({
          codPagtoMarco: z.string().transform(Number),
        }),
      },
    },
    async (request, reply) => {
      const { codPagtoMarco } = request.params

      const pagamento = await prisma.pagto_marco_concluido.findUnique({
        where: { codPagtoMarco },
      })

      if (!pagamento) {
        return reply.status(404).send({ error: 'Pagamento não encontrado' })
      }

      const fakeHash = randomBytes(16).toString('hex')

      const transacao = await prisma.transacao_blockchain.create({
        data: {
          tipo: 'pagamento_marco',
          hash: fakeHash,
          valor: pagamento.bc_valor,
          data: new Date(),
          status: 'confirmada',
          codPagtoMarco: pagamento.codPagtoMarco,
        },
      })

      return reply.send({
        message: 'Pagamento confirmado e transação registrada.',
        transacao,
      })
    }
  )
}

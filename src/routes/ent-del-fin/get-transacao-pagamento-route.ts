import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import prisma from '../../lib/prisma'
import { Perfil, verificarPermissao } from '../../middlewares/auth'

export const getTransacaoPagamentoRoute: FastifyPluginAsyncZod = async app => {
    app.get(
        '/api/pagamentos/:codPagtoMarco/transacao',
        {
            preHandler: verificarPermissao([Perfil.ENT_DEL_FIN, Perfil.ENT_DEL_TEC, Perfil.ENTIDADE_EXECUTORA, Perfil.INVESTIDOR]),
            schema: {
                summary: 'Buscar transação de um pagamento de marco',
                tags: ['Pagamento'],
                params: z.object({
                    codPagtoMarco: z.coerce.number(),
                }),
                response: {
                    200: z.object({
                        hash: z.string().nullable(),
                        data: z.date().nullable(),
                        status: z.string().nullable(),
                    }),
                    404: z.object({ error: z.string() }),
                },
            },
        },
        async (request, reply) => {
            const { codPagtoMarco } = request.params

            const transacao = await prisma.transacao_blockchain.findFirst({
                where: {
                    codPagtoMarco,
                    tipo: 'pagamento_marco',
                },
                orderBy: {
                    data: 'desc'
                }
            })

            if (!transacao) {
                return reply.status(200).send({ hash: null, data: null, status: null })
            }

            return reply.status(200).send({
                hash: transacao.hash,
                data: transacao.data,
                status: transacao.status,
            })
        }
    )
}

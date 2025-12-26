import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { getSaldosAportes } from '../../functions/ent-del-fin/get-saldos-aportes'
import { Perfil, verificarPermissao } from '../../middlewares/auth'

export const getSaldosAportesRoute: FastifyPluginAsyncZod = async app => {
    app.get(
        '/api/aportes/saldos',
        {
            preHandler: verificarPermissao([Perfil.ENT_DEL_FIN]),
            schema: {
                summary: 'Listar aportes com saldo disponível para alocação',
                tags: ['Alocação'],
                response: {
                    200: z.array(z.object({
                        codAporte: z.number(),
                        investidor: z.string(),
                        valorTotal: z.number(),
                        totalAlocado: z.number(),
                        saldoDisponivel: z.number(),
                        dataInvestimento: z.date(),
                    })),
                },
            },
        },
        async (request, reply) => {
            const saldos = await getSaldosAportes()
            return reply.send(saldos)
        }
    )
}

import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { getRastreabilidadeAporte } from '../../functions/investidor/get-rastreabilidade-aporte'
import { Perfil, verificarPermissao } from '../../middlewares/auth'

export const getRastreabilidadeAporteRoute: FastifyPluginAsyncZod = async app => {
    app.get(
        '/api/aportes/:codAporte/rastreabilidade',
        {
            preHandler: verificarPermissao([Perfil.INVESTIDOR, Perfil.ENT_DEL_FIN, Perfil.ENT_DEL_TEC]),
            schema: {
                summary: 'Obter rastreabilidade completa de um aporte',
                tags: ['Investidor'],
                params: z.object({
                    codAporte: z.coerce.number(),
                }),
                response: {
                    200: z.object({
                        codAporte: z.number(),
                        valorTotal: z.number(),
                        dataInvestimento: z.date(),
                        txHashAporte: z.string().optional(),
                        explorerUrlAporte: z.string().nullable().optional(),
                        alocacoes: z.array(z.object({
                            codAlocacao: z.number(),
                            valorAlocado: z.number(),
                            dataAlocacao: z.date(),
                            txHashAlocacao: z.string().nullable(),
                            projeto: z.object({
                                codProjeto: z.number(),
                                titulo: z.string().nullable(),
                                pagamentos: z.array(z.object({
                                    codPagtoMarco: z.number(),
                                    valorPago: z.number(),
                                    dataPagamento: z.date(),
                                    marco: z.string(),
                                    txHashPagamento: z.string().optional(),
                                }))
                            })
                        }))
                    }),
                    404: z.object({ error: z.string() }),
                },
            },
        },
        async (request, reply) => {
            const { codAporte } = request.params

            try {
                const rastreabilidade = await getRastreabilidadeAporte(codAporte)
                return reply.send(rastreabilidade)
            } catch (error: any) {
                return reply.status(404).send({ error: error.message })
            }
        }
    )
}

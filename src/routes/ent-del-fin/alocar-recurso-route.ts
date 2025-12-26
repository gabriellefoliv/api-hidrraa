import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import prisma from '../../lib/prisma'
import { registrarAlocacaoBlockchain } from '../../functions/ent-del-fin/registrar-alocacao-blockchain'
import { Perfil, verificarPermissao } from '../../middlewares/auth'

export const alocarRecursoRoute: FastifyPluginAsyncZod = async app => {
    app.post(
        '/api/alocacoes',
        {
            preHandler: verificarPermissao([Perfil.ENT_DEL_FIN]),
            schema: {
                summary: 'Alocar recursos de um aporte para um projeto',
                tags: ['Alocação'],
                body: z.object({
                    codAporte: z.number(),
                    codProjeto: z.number(),
                    valor: z.number().positive(),
                }),
                response: {
                    201: z.object({
                        message: z.string(),
                        alocacao: z.object({
                            codAlocacao: z.number(),
                            codAporte: z.number(),
                            codProjeto: z.number(),
                            valor: z.number(),
                            data: z.date(),
                            txHash: z.string().nullable(),
                        }),
                    }),
                    400: z.object({ error: z.string() }),
                    404: z.object({ error: z.string() }),
                    500: z.object({ error: z.string() }),
                },
            },
        },
        async (request, reply) => {
            const { codAporte, codProjeto, valor } = request.body

            const aporte = await prisma.aporte.findUnique({
                where: { codAporte },
                include: { alocacoes: true },
            })

            if (!aporte) {
                return reply.status(404).send({ error: 'Aporte não encontrado.' })
            }

            const projeto = await prisma.projeto.findUnique({
                where: { codProjeto },
            })

            if (!projeto) {
                return reply.status(404).send({ error: 'Projeto não encontrado.' })
            }

            const totalAlocado = aporte.alocacoes.reduce((acc, curr) => acc + curr.valor, 0)
            const saldoDisponivel = aporte.bc_valor - totalAlocado

            if (valor > saldoDisponivel) {
                return reply.status(400).send({
                    error: `Saldo insuficiente no aporte. Disponível: ${saldoDisponivel}, Solicitado: ${valor}`,
                })
            }

            try {
                const blockchainReceipt = await registrarAlocacaoBlockchain({
                    codAporte,
                    codProjeto,
                    valor,
                })

                const alocacao = await prisma.alocacao_recurso.create({
                    data: {
                        codAporte,
                        codProjeto,
                        valor,
                        data: new Date(blockchainReceipt.timestamp),
                        txHash: blockchainReceipt.sequenceNumber,
                    },
                })

                return reply.status(201).send({
                    message: 'Recurso alocado com sucesso.',
                    alocacao,
                })
            } catch (error: any) {
                console.error('Erro ao alocar recurso:', error)
                return reply.status(500).send({
                    error: error.message || 'Erro interno ao processar alocação.',
                })
            }
        }
    )
}

import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { registrarPagamentoBlockchain } from '../../functions/ent-del-fin/registrar-pagamento-blockchain'
import { registrarAlocacaoBlockchain } from '../../functions/ent-del-fin/registrar-alocacao-blockchain'
import prisma from '../../lib/prisma'
import { Perfil, verificarPermissao } from '../../middlewares/auth'

export const confirmarPagamentoComAlocacaoRoute: FastifyPluginAsyncZod = async app => {
    app.post(
        '/api/pagamentos/:codPagtoMarco/confirmar-com-alocacao',
        {
            preHandler: verificarPermissao([Perfil.ENT_DEL_FIN]),
            schema: {
                summary: 'Confirmar pagamento de marco com alocação automática (FIFO)',
                tags: ['Pagamento'],
                params: z.object({
                    codPagtoMarco: z.coerce.number(),
                }),
                response: {
                    200: z.object({
                        message: z.string(),
                        transacao: z.object({
                            hash: z.string(),
                        }),
                        alocacoes: z.array(z.object({
                            codAporte: z.number(),
                            valor: z.number()
                        }))
                    }),
                    400: z.object({ error: z.string() }),
                    404: z.object({ error: z.string() }),
                    500: z.object({ error: z.string() }),
                },
            },
        },
        async (request, reply) => {
            const { codPagtoMarco } = request.params

            try {
                const pagamento = await prisma.pagto_marco_concluido.findUnique({
                    where: { codPagtoMarco },
                    include: {
                        execucao_marco: {
                            include: {
                                projeto: true
                            }
                        }
                    }
                })

                if (!pagamento || pagamento.bc_valor === null) {
                    return reply.status(404).send({ error: 'Pagamento não encontrado ou valor inválido' })
                }

                const codProjeto = pagamento.execucao_marco.projeto.codProjeto
                const valorPagamento = pagamento.bc_valor // Valor em Float (Reais)

                const aportes = await prisma.aporte.findMany({
                    where: { validadoAGEVAP: true },
                    orderBy: { dataInvestimento: 'asc' },
                    include: { alocacoes: true }
                })

                const aportesComSaldo = aportes.map(a => {
                    const usado = a.alocacoes.reduce((acc, curr) => acc + curr.valor, 0)
                    const disponivel = a.bc_valor - usado
                    return { ...a, disponivel }
                }).filter(a => a.disponivel > 0.001)

                let valorRestante = valorPagamento
                const novasAlocacoes: { codAporte: number, valor: number }[] = []

                for (const aporte of aportesComSaldo) {
                    if (valorRestante <= 0.0001) break

                    const valorAUsar = Math.min(valorRestante, aporte.disponivel)
                    novasAlocacoes.push({
                        codAporte: aporte.codAporte,
                        valor: valorAUsar
                    })
                    valorRestante -= valorAUsar
                }

                if (valorRestante > 0.001) {
                    return reply.status(400).send({
                        error: `Saldo insuficiente no Cofre. Faltam R$ ${valorRestante.toFixed(2)}`
                    })
                }

                const pagtoReceipt = await registrarPagamentoBlockchain({
                    codPagtoMarco: pagamento.codPagtoMarco,
                    valor: pagamento.bc_valor,
                    codExecucaoMarco: pagamento.codExecucaoMarco,
                })

                for (const aloc of novasAlocacoes) {
                    await registrarAlocacaoBlockchain({
                        codAporte: aloc.codAporte,
                        codProjeto: codProjeto,
                        valor: aloc.valor
                    })
                }

                await prisma.$transaction(async (tx) => {
                    for (const aloc of novasAlocacoes) {
                        await tx.alocacao_recurso.create({
                            data: {
                                codAporte: aloc.codAporte,
                                codProjeto: codProjeto,
                                valor: aloc.valor,
                                data: new Date(),
                                txHash: pagtoReceipt.sequenceNumber
                            }
                        })
                    }

                    await tx.transacao_blockchain.create({
                        data: {
                            tipo: 'pagamento_marco',
                            hash: pagtoReceipt.sequenceNumber,
                            valor: pagamento.bc_valor,
                            data: new Date(pagtoReceipt.timestamp),
                            status: 'confirmada',
                            codPagtoMarco: pagamento.codPagtoMarco,
                        }
                    })
                })

                return reply.status(200).send({
                    message: 'Pagamento confirmado e recursos alocados automaticamente (FIFO).',
                    transacao: {
                        hash: pagtoReceipt.sequenceNumber,
                    },
                    alocacoes: novasAlocacoes
                })

            } catch (error: any) {
                console.error('Erro ao confirmar pagamento com alocação:', error)
                return reply.status(500).send({ error: error.message || 'Erro interno' })
            }
        }
    )
}

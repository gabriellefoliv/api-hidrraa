import prisma from '../../lib/prisma'

export async function getRastreabilidadeAporte(codAporte: number) {
    const aporte = await prisma.aporte.findUnique({
        where: { codAporte },
        include: {
            transacoes: {
                where: { tipo: 'aporte' },
                take: 1,
            },
            alocacoes: {
                include: {
                    projeto: {
                        include: {
                            pagto_marco_concluido: {
                                include: {
                                    transacoes: {
                                        where: { tipo: 'pagamento_marco' },
                                        take: 1,
                                    },
                                    execucao_marco: {
                                        include: {
                                            marco_recomendado: true
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    })

    if (!aporte) {
        throw new Error('Aporte não encontrado')
    }

    // 2. Montar estrutura de resposta
    return {
        codAporte: aporte.codAporte,
        valorTotal: aporte.bc_valor,
        dataInvestimento: aporte.dataInvestimento,
        txHashAporte: aporte.transacoes[0]?.hash,
        explorerUrlAporte: aporte.transacoes[0]?.explorerUrl,
        alocacoes: aporte.alocacoes.map(aloc => ({
            codAlocacao: aloc.codAlocacao,
            valorAlocado: aloc.valor,
            dataAlocacao: aloc.data,
            txHashAlocacao: aloc.txHash,
            projeto: {
                codProjeto: aloc.projeto.codProjeto,
                titulo: aloc.projeto.titulo,
                pagamentos: aloc.projeto.pagto_marco_concluido.map(pagto => ({
                    codPagtoMarco: pagto.codPagtoMarco,
                    valorPago: pagto.bc_valor,
                    dataPagamento: pagto.bc_data,
                    marco: pagto.execucao_marco.marco_recomendado.descricao,
                    txHashPagamento: pagto.transacoes[0]?.hash,
                }))
            }
        }))
    }
}

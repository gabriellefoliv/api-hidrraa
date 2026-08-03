import fs from 'node:fs'
import path from 'node:path'
import { randomUUID } from 'node:crypto'
import { pipeline } from 'node:stream/promises'
import { relatorioRepository } from './relatorio.repository'
import { Readable } from 'node:stream'

export const relatorioService = {
    uploadReport: async (
        fileBuffer: Buffer,
        filename: string,
        codProjeto: number,
        codExecucaoMarco: number,
        codEntGer: number
    ) => {
        const execucaoMarco = await relatorioRepository.findExecutionMilestone(codExecucaoMarco)
        if (!execucaoMarco) throw new Error('Execução de marco não encontrada')
        if (execucaoMarco.dataConclusaoEfetiva === null) throw new Error('Não é possível enviar relatório antes da submissão das evidências.')

        const ext = path.extname(filename).toLowerCase()
        const fileId = randomUUID()
        const finalFileName = `${fileId}${ext}`
        const uploadDir = path.resolve(
            'uploads',
            'laudos_gerenciadora',
            String(codProjeto),
            String(codExecucaoMarco)
        )
        await fs.promises.mkdir(uploadDir, { recursive: true })
        const filePath = path.join(uploadDir, finalFileName)

        await fs.promises.writeFile(filePath, fileBuffer)

        await relatorioRepository.createReport({
            codExecucaoMarco,
            codEntGer,
            caminhoArquivo: path.relative('uploads', filePath)
        })

        return { message: 'Relatório enviado com sucesso', filePath: filePath }
    },

    listSubmittedEvidences: async (codProjeto: number, codExecucaoMarco: number) => {
        const execucoes = await relatorioRepository.listSubmittedEvidences(codProjeto, codExecucaoMarco)
        return execucoes.map(execucao => ({
            ...execucao,
            descricao: execucao.descricao ?? '',
        }))
    },

    generateFinancialReport: async (codInvestidor: number) => {
        const data = await relatorioRepository.getFinancialTraceability(codInvestidor)

        // Flatten and structure for the Report UI
        return data.map(aporte => {
            const mintTx = aporte.transacoes.find(t => t.tipo === 'aporte');

            return {
                id: aporte.codAporte,
                tipo: 'Investment',
                data: aporte.dataInvestimento,
                valor: aporte.bc_valor,
                status: 'Ingested',
                nft: {
                    serial: (aporte as any).serialNumber,
                    txId: mintTx?.hash,
                    explorerUrl: mintTx?.explorerUrl
                },
                flow: aporte.alocacoes.map(aloc => {
                    // Allocations (Processamento)
                    return {
                        id: aloc.codAlocacao,
                        tipo: 'Allocation',
                        projeto: aloc.projeto.titulo,
                        entidade: aloc.projeto.entidadeexecutora?.nome,
                        valor: aloc.valor,
                        data: aloc.data,
                        contractTxId: aloc.txHash, // Contract Interaction
                        explorerUrl: aloc.txHash ? `https://hashscan.io/testnet/transaction/${aloc.txHash}` : null,
                        // Liquidation (Payments related to this project that used funds)
                        // Note: Ideally we track exact cents, but for this level we show Project Payments as "Outflows"
                        // FIX: Filter payments that happened BEFORE this allocation (Physically impossible to fund)
                        outflows: aloc.projeto.execucao_marco.flatMap(em =>
                            em.pagto_marco_concluido
                                .filter(pm => new Date(pm.bc_data) >= new Date(aloc.data))
                                .map(pm => {
                                    const burnTx = pm.transacoes.find(t => true); // Any tx linked is likely the burn/payment
                                    return {
                                        id: pm.codPagtoMarco,
                                        tipo: 'Payment',
                                        marco: em.marco_recomendado.descricao,
                                        valor: pm.bc_valor,
                                        data: pm.bc_data,
                                        burnTxId: burnTx?.hash,
                                        explorerUrl: burnTx?.explorerUrl
                                    }
                                })
                        ).sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime()) // Sort by date
                    }
                })
            }
        })
    }
}

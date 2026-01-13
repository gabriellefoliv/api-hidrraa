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
    }
}

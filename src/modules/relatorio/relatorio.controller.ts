import { relatorioService } from './relatorio.service'
import path from 'node:path'

export const uploadRelatorioHandler = async (request: any, reply: any) => {
    const getValue = (field: any) => field?.value ?? field

    const body = request.body
    if (!body) return reply.status(400).send({ error: 'Corpo da requisição vazio.' })

    const codProjeto = Number(getValue(body.codProjeto))
    const codExecucaoMarco = Number(getValue(body.codExecucaoMarco))
    const codEntGer = Number(getValue(body.codEntGer))
    const file = body.file

    if (!codProjeto || !codExecucaoMarco || !codEntGer || !file) {
        return reply.status(400).send({ error: 'Informações incompletas (codProjeto, codExecucaoMarco, codEntGer, file).' })
    }

    try {
        const buffer = await file.toBuffer()
        const result = await relatorioService.uploadReport(
            buffer,
            file.filename,
            codProjeto,
            codExecucaoMarco,
            codEntGer
        )
        return reply.send({ message: 'Relatório enviado com sucesso', arquivos: [{ filename: file.filename, filepath: result.filePath }] })
    } catch (error: any) {
        console.error(error)
        return reply.status(500).send({ error: error.message || 'Erro interno ao salvar relatório.' })
    }
}

export const listarEvidenciasSubmetidasHandler = async (request: any, reply: any) => {
    const { codProjeto, codExecucaoMarco } = request.params
    const result = await relatorioService.listSubmittedEvidences(codProjeto, codExecucaoMarco)
    return reply.status(200).send(result)
}

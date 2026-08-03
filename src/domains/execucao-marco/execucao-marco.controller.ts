import { execucaoMarcoService } from './execucao-marco.service'
import path from 'node:path'
import fs from 'node:fs'
import { randomUUID } from 'node:crypto'
import { pipeline } from 'node:stream/promises'
import z from 'zod'

export const getProjectForExecutionHandler = async (request: any, reply: any) => {
    const { codProjeto } = request.params
    try {
        const result = await execucaoMarcoService.getProjectForExecution(codProjeto)
        return reply.status(200).send(result)
    } catch (error: any) {
        return reply.status(404).send({ error: error.message || 'Projeto não encontrado.' })
    }
}

export const submeterEvidenciasHandler = async (request: any, reply: any) => {
    const { codExecucaoMarco } = request.body
    try {
        const result = await execucaoMarcoService.submitEvidences(codExecucaoMarco)
        return reply.status(200).send(result)
    } catch (error: any) {
        return reply.status(400).send({ error: error.message })
    }
}

export const uploadEvidenciaHandler = async (request: any, reply: any) => {
    const getValue = (field: any) => field?.value ?? field

    const body = request.body
    if (!body) return reply.status(400).send({ error: 'Corpo da requisição vazio.' })

    const codProjeto = Number(getValue(body.codProjeto))
    const codExecucaoMarco = Number(getValue(body.codExecucaoMarco))
    const codEvidenciaDemandada = Number(getValue(body.codEvidenciaDemandada))
    const tipo = getValue(body.tipo) as 'fotos' | 'documentos'
    const file = body.file

    if (!codProjeto || !codExecucaoMarco || !codEvidenciaDemandada || !tipo || !file) {
        return reply.status(400).send({ error: 'Informações incompletas (codProjeto, codExecucaoMarco, codEvidenciaDemandada, tipo, file).' })
    }

    try {
        const buffer = await file.toBuffer()
        await execucaoMarcoService.saveEvidenceFile(
            buffer,
            file.filename,
            codProjeto,
            codExecucaoMarco,
            codEvidenciaDemandada,
            tipo
        )
        return reply.send({ message: 'Upload concluído', arquivos: [{ filename: file.filename, filepath: 'saved_via_service' }] })
    } catch (error: any) {
        console.error(error)
        return reply.status(500).send({ error: error.message || 'Erro interno ao salvar evidência.' })
    }
}

export const excluirEvidenciaHandler = async (request: any, reply: any) => {
    const { codEvidenciaApresentada } = request.params
    try {
        const result = await execucaoMarcoService.deleteEvidence(codEvidenciaApresentada)
        return reply.status(200).send(result)
    } catch (error: any) {
        return reply.status(400).send({ error: error.message })
    }
}

export const listarEvidenciasHandler = async (request: any, reply: any) => {
    const { codProjeto, codExecucaoMarco } = request.params
    const result = await execucaoMarcoService.listEvidencesByMilestone(codProjeto, codExecucaoMarco)
    if (!result) return reply.status(404).send({ error: 'Evidências não encontradas.' })
    return reply.status(200).send(result)
}

export const listEvaluatedEvidencesHandler = async (request: any, reply: any) => {
    const { codProjeto } = request.params
    try {
        const result = await execucaoMarcoService.listEvaluatedEvidences(codProjeto)
        if (!result) return reply.status(404).send({ error: 'Projeto não encontrado.' })
        return reply.status(200).send(result)
    } catch (error: any) {
        return reply.status(500).send({ error: error.message })
    }
}

const servicoSchema = z.object({
    valor: z.coerce.number(),
    fileId: z.string(),
})

export const solicitarFinanciamentoHandler = async (request: any, reply: any) => {
    const getValue = (field: any) => field?.value ?? field
    const body = request.body
    const { codUsuario } = request.user

    const codExecucaoMarco = Number(getValue(body.codExecucaoMarco))
    const codProjeto = Number(getValue(body.codProjeto))
    const valorSolicitado = Number(getValue(body.valorSolicitado))
    let servicosValidados: any[] = []

    try {
        const json = getValue(body.servicosJSON)
        servicosValidados = z.array(servicoSchema).parse(typeof json === 'string' ? JSON.parse(json) : json)
    } catch (e) {
        return reply.status(400).send({ error: 'JSON de serviços inválido.' })
    }

    if (!codExecucaoMarco || !codProjeto || !valorSolicitado || !servicosValidados.length) {
        return reply.status(400).send({ error: 'Campos obrigatórios faltando.' })
    }

    for (const servico of servicosValidados) {
        if (!body[servico.fileId]) {
            return reply.status(400).send({ error: `Arquivo faltando para o serviço (ID: ${servico.fileId})` })
        }
    }

    const servicosParaFuncao = []

    try {
        for (const servico of servicosValidados) {
            const fileObj = body[servico.fileId]
            const file = Array.isArray(fileObj) ? fileObj[0] : fileObj

            const buffer = await file.toBuffer()

            const finalDir = path.resolve('uploads', 'documentos_para_pagamentos', String(codProjeto), String(codExecucaoMarco))
            await fs.promises.mkdir(finalDir, { recursive: true })

            const ext = path.extname(file.filename).toLowerCase()
            const finalName = `${randomUUID()}${ext}`
            const finalPath = path.join(finalDir, finalName)

            await fs.promises.writeFile(finalPath, buffer)

            servicosParaFuncao.push({
                valor: servico.valor,
                docNFPath: path.relative('uploads', finalPath)
            })
        }

        const result = await execucaoMarcoService.requestFinancing(codUsuario, codExecucaoMarco, valorSolicitado, servicosParaFuncao)
        return reply.status(201).send(result)

    } catch (e: any) {
        console.error(e)
        fs.writeFileSync('error_log.txt', JSON.stringify(e, Object.getOwnPropertyNames(e), 2))
        return reply.status(500).send({ error: e.message || 'Erro interno ao processar financiamento.' })
    }
}

import { analiseEvidenciaService } from './analise-evidencia.service'
import path from 'node:path'
import fs from 'node:fs'
import { randomUUID } from 'node:crypto'
import { pipeline } from 'node:stream/promises'

const getValue = (field: any): string | undefined => {
    if (!field) return undefined;
    return field.value ?? field;
}

export const validarEvidenciasHandler = async (request: any, reply: any) => {
    const { codExecucaoMarco } = request.params
    const { codUsuario } = request.user

    const body = request.body || {}
    const statusRaw = getValue(body.status)
    const comentario = getValue(body.comentario)
    const filePart = body.relatorioValidacao

    let status: 'APROVADO' | 'REPROVADO' | 'PENDENTE' | null = null
    let tempFilePath: string | undefined

    try {
        if (statusRaw && ['APROVADO', 'REPROVADO', 'PENDENTE'].includes(statusRaw)) {
            status = statusRaw as any
        } else {
            throw new Error('Status inválido ou obrigatório.')
        }

        if (filePart) {
            const tempDir = path.resolve('uploads', 'temp_delegataria_marcos')
            await fs.promises.mkdir(tempDir, { recursive: true })

            const filename = filePart.filename || `upload-${Date.now()}`
            const ext = path.extname(filename).toLowerCase() || '.dat'
            const tempFileName = `${randomUUID()}${ext}`
            tempFilePath = path.join(tempDir, tempFileName)

            const buffer = await filePart.toBuffer()
            await fs.promises.writeFile(tempFilePath, buffer)
        }

        const result = await analiseEvidenciaService.validateEvidence(codExecucaoMarco, status!, Number(codUsuario), comentario, tempFilePath)
        return reply.status(200).send(result)

    } catch (err: any) {
        if (tempFilePath) await fs.promises.unlink(tempFilePath).catch(console.error)

        const statusCode = err.message.includes('não encontrado') ? 404 : 400
        return reply.status(statusCode).send({ error: err.message })
    }
}

export const listarProjetosComEvidenciasHandler = async (request: any, reply: any) => {
    try {
        const result = await analiseEvidenciaService.listProjectsWithEvidences()
        return reply.status(200).send(result)
    } catch (error: any) {
        return reply.status(500).send({ error: error.message })
    }
}

export const listarMarcosCompletosHandler = async (request: any, reply: any) => {
    const { codProjeto } = request.params
    try {
        const result = await analiseEvidenciaService.listCompletedMilestones(codProjeto)
        return reply.status(200).send(result)
    } catch (error: any) {
        return reply.status(404).send({ error: error.message })
    }
}

export const getProjectWithEvaluatedMilestonesHandler = async (request: any, reply: any) => {
    const { codProjeto } = request.params
    try {
        const result = await analiseEvidenciaService.getProjectWithEvaluatedMilestones(Number(codProjeto))
        return reply.status(200).send(result)
    } catch (error: any) {
        const statusCode = error.message === 'Projeto não encontrado.' ? 404 : 500
        return reply.status(statusCode).send({ error: error.message })
    }
}

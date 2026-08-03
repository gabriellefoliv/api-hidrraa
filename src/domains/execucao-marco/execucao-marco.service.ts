import fs from 'node:fs'
import path from 'node:path'
import { randomUUID } from 'node:crypto'
import { pipeline } from 'node:stream/promises'
import sharp from 'sharp'
import { execucaoMarcoRepository } from './execucao-marco.repository'
import { Readable } from 'node:stream'

export const execucaoMarcoService = {
    getProjectForExecution: async (codProjeto: number) => {
        const projeto = await execucaoMarcoRepository.findProjectForExecution(codProjeto)
        if (!projeto) throw new Error('Projeto não encontrado.')

        const execucaoMarcos = projeto.tipo_projeto.marco_recomendado.flatMap(marco =>
            marco.execucao_marco
                .filter(exec => exec.codProjeto === projeto.codProjeto)
                .map(exec => ({
                    codExecucaoMarco: exec.codExecucaoMarco,
                    codMarcoRecomendado: marco.codMarcoRecomendado,
                    descricao: exec.descricao,
                    valorEstimado: exec.valorEstimado,
                    dataConclusaoPrevista: exec.dataConclusaoPrevista,
                    dataConclusaoEfetiva: exec.dataConclusaoEfetiva,
                    evidenciasDemandadas: marco.evidencia_demandada.map(ed => ({
                        codEvidenciaDemandada: ed.codEvidenciaDemandada,
                        descricao: ed.descricao,
                        tipoArquivo: ed.tipoArquivo
                    }))
                }))
        )

        return {
            codProjeto: projeto.codProjeto,
            titulo: projeto.titulo,
            objetivo: projeto.objetivo,
            acoes: projeto.acoes,
            cronograma: projeto.cronograma,
            orcamento: projeto.orcamento,
            dataSubmissao: projeto.dataSubmissao,
            codPropriedade: projeto.codPropriedade,
            CodMicroBacia: projeto.CodMicroBacia,
            CodEntExec: projeto.CodEntExec,
            tipo_projeto: {
                codTipoProjeto: projeto.tipo_projeto.codTipoProjeto,
                nome: projeto.tipo_projeto.nome,
                descricao: projeto.tipo_projeto.descricao,
                execucao_marcos: execucaoMarcos,
            },
        }
    },

    saveEvidenceFile: async (
        fileBuffer: Buffer,
        filename: string,
        codProjeto: number,
        codExecucaoMarco: number,
        codEvidenciaDemandada: number,
        tipo: 'fotos' | 'documentos'
    ) => {
        const execucaoMarco = await execucaoMarcoRepository.findExecucaoMarco(codExecucaoMarco)
        if (!execucaoMarco) throw new Error('Execução de marco não encontrada')
        if (execucaoMarco.dataConclusaoEfetiva !== null) throw new Error('Não é possível enviar evidências após a conclusão do marco.')

        const ext = path.extname(filename).toLowerCase()
        const fileId = randomUUID()
        const finalFileName = `${fileId}${ext}`
        const uploadDir = path.resolve(
            'uploads',
            'evidencias_executora',
            String(codProjeto),
            String(codExecucaoMarco),
            tipo
        )
        await fs.promises.mkdir(uploadDir, { recursive: true })
        const filePath = path.join(uploadDir, finalFileName)

        let finalBuffer = fileBuffer
        if (tipo === 'fotos') {
            if (ext === '.jpg' || ext === '.jpeg') {
                finalBuffer = await sharp(fileBuffer).jpeg({ quality: 80, mozjpeg: true }).toBuffer()
            } else if (ext === '.png') {
                finalBuffer = await sharp(fileBuffer).png({ quality: 90, compressionLevel: 9 }).toBuffer()
            }
        }

        await fs.promises.writeFile(filePath, finalBuffer)

        return execucaoMarcoRepository.createEvidence({
            caminhoArquivo: path.relative('uploads', filePath),
            codExecucaoMarco,
            codEvidenciaDemandada
        })
    },

    submitEvidences: async (codExecucaoMarco: number) => {
        const exec = await execucaoMarcoRepository.findExecucaoMarco(codExecucaoMarco)
        if (!exec) throw new Error('Execução de marco não encontrada.')
        if (exec.dataConclusaoEfetiva) throw new Error('Evidências já submetidas.')

        await execucaoMarcoRepository.submitEvidences(codExecucaoMarco)
        return { mensagem: 'Evidências submetidas com sucesso.' }
    },

    deleteEvidence: async (codEvidenciaApresentada: number) => {
        const evidencia = await execucaoMarcoRepository.findEvidenceById(codEvidenciaApresentada)
        if (!evidencia) throw new Error('Evidência não encontrada.')

        const exec = await execucaoMarcoRepository.findExecucaoMarco(evidencia.codExecucaoMarco)
        if (exec?.dataConclusaoEfetiva) throw new Error('Marco concluído, não é possível excluir.')

        // Remove file
        const absolutePath = path.resolve('uploads', evidencia.caminhoArquivo)
        await fs.promises.unlink(absolutePath).catch(console.error)

        await execucaoMarcoRepository.deleteEvidence(codEvidenciaApresentada)
        return { mensagem: 'Evidência excluída com sucesso.' }
    },

    listEvaluatedEvidences: async (codProjeto: number) => {
        return execucaoMarcoRepository.listEvaluatedEvidences(codProjeto)
    },

    listEvidencesByMilestone: async (codProjeto: number, codExecucaoMarco: number) => {
        return execucaoMarcoRepository.listEvidencesByMilestone(codProjeto, codExecucaoMarco)
    },

    getBalance: async (codProjeto: number) => {
        const [projeto, aggregate] = await Promise.all([
            execucaoMarcoRepository.findProjectBudget(codProjeto),
            execucaoMarcoRepository.aggregateProjectPayments(codProjeto)
        ])

        const valorLiberado = projeto?.orcamento ?? 0
        const totalJaPago = aggregate._sum.bc_valor ?? 0
        const saldoDisponivel = valorLiberado - totalJaPago

        return { saldoDisponivel }
    },

    requestFinancing: async (codUsuario: number, codExecucaoMarco: number, valorSolicitado: number, servicos: any[]) => {
        const entExec = await execucaoMarcoRepository.findEntExecByUsuario(codUsuario)
        if (!entExec) throw new Error('Entidade Executora não encontrada.')

        const marco = await execucaoMarcoRepository.findExecucaoMarco(codExecucaoMarco)
        if (!marco) throw new Error('Marco não encontrado.')

        const pagamentos = await execucaoMarcoRepository.getPaymentsSum(codExecucaoMarco)
        const totalJaPago = pagamentos._sum.bc_valor ?? 0
        const saldoDisponivel = (marco.valorEstimado ?? 0) - totalJaPago

        console.log(`Debug Financiamento: Est: ${marco.valorEstimado}, Pago: ${totalJaPago}, Saldo: ${saldoDisponivel}, Solic: ${valorSolicitado}`)

        if (valorSolicitado > saldoDisponivel + 0.01) { // Adding small epsilon tolerance for float issues
            throw new Error(`Valor solicitado (${valorSolicitado}) excede o saldo disponível (${saldoDisponivel}).`)
        }

        return execucaoMarcoRepository.createPaymentRequest({
            codExecucaoMarco,
            bc_valor: valorSolicitado,
            CodEntExec: entExec.codEntExec,
            servicos
        })
    }
}

import fs from 'node:fs'
import path from 'node:path'
import { randomUUID } from 'node:crypto'
import { analiseEvidenciaRepository } from './analise-evidencia.repository'

export const analiseEvidenciaService = {
    validateEvidence: async (
        codExecucaoMarco: number,
        status: 'APROVADO' | 'REPROVADO' | 'PENDENTE',
        codUsuario: number,
        comentario?: string,
        tempFilePath?: string
    ) => {
        const execucaoMarco = await analiseEvidenciaRepository.findExecutionMilestone(codExecucaoMarco)
        if (!execucaoMarco) throw new Error('Marco de execução não encontrado.')

        if (tempFilePath) {
            const entGer = await analiseEvidenciaRepository.findEntGerByUsuario(codUsuario)

            if (entGer) {
                const codProjeto = execucaoMarco.codProjeto
                const finalDir = path.resolve(
                    'uploads',
                    'relatorios_gerenciadora',
                    String(codProjeto),
                    String(codExecucaoMarco)
                )
                await fs.promises.mkdir(finalDir, { recursive: true })
                const finalFileName = `${randomUUID()}${path.extname(tempFilePath)}`
                const finalFilePath = path.join(finalDir, finalFileName)

                await fs.promises.rename(tempFilePath, finalFilePath)

                await analiseEvidenciaRepository.createRelatorioGerenciadora({
                    caminhoArquivo: path.relative('uploads', finalFilePath),
                    codExecucaoMarco,
                    codEntGer: entGer.codEntGer
                })
            } else {
                console.warn("Usuário validador não possui entidade gerenciadora vinculada. Relatório não salvo.")
            }
        }

        const updateData: any = {
            bc_statusValidacaoCBH: status,
            descrDetAjustes: comentario,
            dataConclusaoEfetiva:
                status === 'PENDENTE' ? null : execucaoMarco.dataConclusaoEfetiva,
        }

        await analiseEvidenciaRepository.updateValidation(codExecucaoMarco, updateData)
        return { message: 'Validação atualizada com sucesso.' }
    },

    listProjectsWithEvidences: async () => {
        const projetos = await analiseEvidenciaRepository.listProjectsWithEvidences()

        return projetos.map(projeto => ({
            ...projeto,
            tipo_projeto: {
                ...projeto.tipo_projeto,
                execucao_marcos: projeto.tipo_projeto.marco_recomendado.flatMap(marco =>
                    marco.execucao_marco
                        .filter(execucao => execucao.codProjeto === projeto.codProjeto)
                        .map(m => ({
                            codExecucaoMarco: m.codExecucaoMarco,
                            descricao: m.descricao || marco.descricao,
                            valorEstimado: m.valorEstimado ?? 0,
                            dataConclusaoPrevista: m.dataConclusaoPrevista,
                            bc_statusValidacaoCBH: m.bc_statusValidacaoCBH
                        }))
                ),
                marco_recomendado: projeto.tipo_projeto.marco_recomendado.map(marco => ({
                    ...marco,
                    execucao_marco: marco.execucao_marco.filter(
                        execucao => execucao.codProjeto === projeto.codProjeto
                    ),
                })),
            },
        }))
    },

    listCompletedMilestones: async (codProjeto: number) => {
        return analiseEvidenciaRepository.listCompletedMilestones(codProjeto)
    },

    getProjectWithEvaluatedMilestones: async (codProjeto: number) => {
        const projeto = await analiseEvidenciaRepository.getProjectWithEvaluatedMilestones(codProjeto)
        if (!projeto) throw new Error('Projeto não encontrado.')
        return projeto
    }
}

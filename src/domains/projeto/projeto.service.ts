import prisma from '../../lib/prisma'
import { Perfil } from '../../middlewares/auth'
import { projetoRepository } from './projeto.repository'

interface ListarProjetosAprovadosContext {
    codUsuario: number
    perfil: string
}

export const projetoService = {
    listarAprovados: async ({ codUsuario, perfil }: ListarProjetosAprovadosContext) => {
        const filters: { CodEntExec?: number; codEntGer?: number } = {}

        if (perfil === Perfil.ENTIDADE_EXECUTORA) {
            const ent = await prisma.entidadeexecutora.findFirst({
                where: { codUsuario },
            })
            if (!ent) {
                throw new Error('Entidade executora não encontrada para o usuário fornecido.')
            }
            filters.CodEntExec = ent.codEntExec
        } else if (perfil === Perfil.ENT_GER) {
            const ent = await prisma.entidade_gerenciadora.findFirst({
                where: { codUsuario },
            })
            if (!ent) {
                throw new Error('Entidade gerenciadora não encontrada para o usuário fornecido.')
            }
            filters.codEntGer = ent.codEntGer
        }

        const projetos = await projetoRepository.findAprovados(filters)

        return projetos.map(proj => ({
            ...proj,
            tipo_projeto: {
                ...proj.tipo_projeto,
                execucao_marcos:
                    proj.tipo_projeto?.marco_recomendado?.flatMap(marco =>
                        marco.execucao_marco
                            .filter(execucao => execucao.codProjeto === proj.codProjeto)
                            .map(m => ({
                                codMarcoRecomendado: marco.codMarcoRecomendado,
                                descricao: m.descricao ?? '',
                                valorEstimado: m.valorEstimado ?? 0,
                                dataConclusaoPrevista: m.dataConclusaoPrevista ?? null,
                            }))
                    ) ?? [],
            },
        }))
    },

    create: async (data: any) => {
        return projetoRepository.create(data)
    },

    update: async (codProjeto: number, data: any) => {
        const { marcos, ...projectData } = data

        let execucaoMarcoUpdate: any = {}
        if (marcos && Array.isArray(marcos)) {

            execucaoMarcoUpdate = {
                execucao_marco: {
                    upsert: marcos.map((m: any) => ({
                        where: { codExecucaoMarco: m.codExecucaoMarco || 0 },
                    }))
                }
            }
        }

        const projeto = await projetoRepository.update(codProjeto, projectData)

        if (marcos && Array.isArray(marcos)) {
            await Promise.all(marcos.map(async (m: any) => {
                if (m.codExecucaoMarco) {
                    await prisma.execucao_marco.update({
                        where: { codExecucaoMarco: m.codExecucaoMarco },
                        data: {
                            descricao: m.descricao,
                            valorEstimado: Number(m.valorEstimado),
                            dataConclusaoPrevista: m.dataConclusaoPrevista ? new Date(m.dataConclusaoPrevista) : null
                        }
                    })
                } else {
                    await prisma.execucao_marco.create({
                        data: {
                            codProjeto,
                            codMarcoRecomendado: m.codMarcoRecomendado,
                            descricao: m.descricao,
                            valorEstimado: Number(m.valorEstimado),
                            dataConclusaoPrevista: m.dataConclusaoPrevista ? new Date(m.dataConclusaoPrevista) : null
                        }
                    })
                }
            }))
        }

        return projeto
    },

    delete: async (codProjeto: number) => {
        return projetoRepository.delete(codProjeto)
    },

    findById: async (codProjeto: number) => {
        const projeto = await projetoRepository.findById(codProjeto)
        if (!projeto) return null

        const execucaoMarcos = await prisma.execucao_marco.findMany({
            where: { codProjeto },
            select: {
                codExecucaoMarco: true,
                codMarcoRecomendado: true,
                descricao: true,
                valorEstimado: true,
                dataConclusaoPrevista: true
            }
        })

        return {
            ...projeto,
            tipo_projeto: {
                ...projeto.tipo_projeto,
                execucao_marcos: execucaoMarcos
            }
        }
    },

    delegarEntExecEntGer: async (codProjeto: number, CodEntExec: number, codEntGer: number) => {
        const projeto = await projetoRepository.findWithSubmissaoCheck(codProjeto)
        if (!projeto) throw new Error('Projeto não encontrado ou não submetido.')
        if (projeto.CodEntExec && projeto.codEntGer) throw new Error('Projeto já possui entidade executora e gestora atribuídas.')

        return projetoRepository.update(codProjeto, { CodEntExec, codEntGer })
    },

    submeter: async (codProjeto: number) => {
        const projeto = await projetoRepository.findById(codProjeto)
        if (!projeto || projeto.dataSubmissao) throw new Error('Projeto não encontrado ou já submetido.')

        return projetoRepository.update(codProjeto, { dataSubmissao: new Date() })
    },

    listarTiposProjeto: async () => {
        const tipos = await projetoRepository.findAllTiposProjeto()
        return tipos.map(t => ({
            id: t.codTipoProjeto,
            codTipoProjeto: t.codTipoProjeto,
            nome: t.nome,
            descricao: t.descricao,
            marcosRecomendados: t.marco_recomendado.map(m => ({
                codMarcoRecomendado: m.codMarcoRecomendado,
                descricao: m.descricao,
                valorEstimado: 0,
                evidenciasDemandadas: m.evidencia_demandada.map(e => ({
                    codEvidenciaDemandada: e.codEvidenciaDemandada,
                    descricao: e.descricao,
                    tipoArquivo: e.tipoArquivo
                }))
            }))
        }))
    },

    listarDetalhesModelo: async (codTipoProjeto: number) => {
        const t = await projetoRepository.findTipoProjetoById(codTipoProjeto)
        if (!t) return null
        return {
            id: t.codTipoProjeto,
            codTipoProjeto: t.codTipoProjeto,
            nome: t.nome,
            descricao: t.descricao,
            marcosRecomendados: t.marco_recomendado.map(m => ({
                codMarcoRecomendado: m.codMarcoRecomendado,
                descricao: m.descricao,
                valorEstimado: 0,
                evidenciasDemandadas: m.evidencia_demandada.map(e => ({
                    codEvidenciaDemandada: e.codEvidenciaDemandada,
                    descricao: e.descricao,
                    tipoArquivo: e.tipoArquivo
                }))
            }))
        }
    },

    listarSalvosPorEntExec: async () => {
        const projetos = await projetoRepository.findSalvosPorEntExec()
        return Promise.all(projetos.map(async projeto => {
            const execucaoMarcos = await prisma.execucao_marco.findMany({
                where: { codProjeto: projeto.codProjeto },
                select: { descricao: true, valorEstimado: true, dataConclusaoPrevista: true }
            })

            return {
                ...projeto,
                tipo_projeto: {
                    ...projeto.tipo_projeto,
                    execucao_marcos: execucaoMarcos
                }
            }
        }))
    },

    listarSubmetidosPorEntExec: async () => {
        const projetos = await projetoRepository.findSubmetidosPorEntExec()
        return Promise.all(projetos.map(async projeto => {
            const execucaoMarcos = await prisma.execucao_marco.findMany({
                where: { codProjeto: projeto.codProjeto },
                select: { descricao: true, valorEstimado: true, dataConclusaoPrevista: true }
            })
            return {
                ...projeto,
                tipo_projeto: {
                    ...projeto.tipo_projeto,
                    execucao_marcos: execucaoMarcos
                }
            }
        }))
    },

    getSaldo: async (codProjeto: number) => {
        const projeto = await projetoRepository.findById(codProjeto)
        if (!projeto) throw new Error('Projeto não encontrado')

        const balanceStats = await projetoRepository.getProjectBalance(codProjeto)

        const saldoFinanceiro = balanceStats.totalAlocado - balanceStats.totalGasto


        return {
            saldoDisponivel: saldoFinanceiro,
            orcamentoTotal: projeto.orcamento ?? 0,
            totalGasto: balanceStats.totalGasto
        }
    }
}

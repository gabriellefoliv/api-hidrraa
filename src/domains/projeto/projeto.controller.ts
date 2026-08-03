import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { projetoService } from './projeto.service'

export const projetoController: FastifyPluginAsyncZod = async app => {
}

export const listarProjetosAprovadosHandler = async (request: any, reply: any) => {
    const { codUsuario, perfil } = request.user as {
        codUsuario: number
        perfil: string
    }

    if (!codUsuario) {
        return reply.status(401).send({ error: 'Usuário não autenticado' })
    }

    try {
        const projetos = await projetoService.listarAprovados({ codUsuario, perfil })
        return reply.status(200).send(projetos)
    } catch (error: any) {
        return reply.status(404).send({ error: error.message || 'Erro ao buscar projetos.' })
    }
}

export const createProjetoHandler = async (request: any, reply: any) => {
    const getValue = (field: any) => field?.value ?? field

    const body = request.body

    const cleanData: any = {
        titulo: getValue(body.titulo),
        objetivo: getValue(body.objetivo),
        acoes: getValue(body.acoes),
        cronograma: getValue(body.cronograma),
        orcamento: Number(getValue(body.orcamento)),
        codPropriedade: Number(getValue(body.codPropriedade)),
        codTipoProjeto: Number(getValue(body.codTipoProjeto)),
        CodMicroBacia: Number(getValue(body.CodMicroBacia)),
    }

    if (body.marcos) {
        try {
            const marcosStr = getValue(body.marcos)
            cleanData.marcos = typeof marcosStr === 'string' ? JSON.parse(marcosStr) : marcosStr
        } catch (e) {
            console.error('Error parsing marcos JSON', e)
            cleanData.marcos = []
        }
    }

    if (cleanData.marcos && Array.isArray(cleanData.marcos)) {
        cleanData.execucao_marco = {
            create: cleanData.marcos.map((m: any) => ({
                codMarcoRecomendado: m.codMarcoRecomendado,
                descricao: m.descricao,
                valorEstimado: Number(m.valorEstimado),
                dataConclusaoPrevista: m.dataConclusaoPrevista ? new Date(m.dataConclusaoPrevista) : null
            }))
        }
        delete cleanData.marcos
    }

    try {
        const projeto = await projetoService.create(cleanData)
        return reply.status(201).send({ projetoId: projeto.codProjeto, ...projeto })
    } catch (e: any) {
        console.error(e)
        return reply.status(500).send({ error: e.message })
    }
}

export const updateProjetoHandler = async (request: any, reply: any) => {
    const { codProjeto } = request.params

    const getValue = (field: any) => field?.value ?? field
    const body = request.body

    const cleanData: any = {}

    if (body.titulo) cleanData.titulo = getValue(body.titulo)
    if (body.objetivo) cleanData.objetivo = getValue(body.objetivo)
    if (body.acoes) cleanData.acoes = getValue(body.acoes)
    if (body.cronograma) cleanData.cronograma = getValue(body.cronograma)
    if (body.orcamento) cleanData.orcamento = Number(getValue(body.orcamento))
    if (body.codPropriedade) cleanData.codPropriedade = Number(getValue(body.codPropriedade))
    if (body.codTipoProjeto) cleanData.codTipoProjeto = Number(getValue(body.codTipoProjeto))
    if (body.CodMicroBacia) cleanData.CodMicroBacia = Number(getValue(body.CodMicroBacia))

    const marcosField = body.marcos
    let marcosArray: any[] = []

    if (marcosField) {
        try {
            const marcosStr = getValue(marcosField)
            marcosArray = typeof marcosStr === 'string' ? JSON.parse(marcosStr) : marcosStr
        } catch (e) {
            console.error('Error parsing marcos JSON in update', e)
        }
    }

    if (marcosArray.length > 0) {
        cleanData.marcos = marcosArray
    }

    try {
        const projeto = await projetoService.update(codProjeto, cleanData)
        return reply.status(201).send(projeto)
    } catch (e: any) {
        console.error(e)
        return reply.status(500).send({ error: e.message })
    }
}

export const deleteProjetoHandler = async (request: any, reply: any) => {
    const { codProjeto } = request.params
    await projetoService.delete(codProjeto)
    return reply.status(201).send({ message: 'Projeto excluído' })
}

export const getProjetoHandler = async (request: any, reply: any) => {
    const { codProjeto } = request.params
    const projeto = await projetoService.findById(codProjeto)
    return reply.status(200).send(projeto)
}

export const delegarEntExecEntGerHandler = async (request: any, reply: any) => {
    const { codProjeto } = request.params
    const { CodEntExec, codEntGer } = request.body
    await projetoService.delegarEntExecEntGer(Number(codProjeto), CodEntExec, codEntGer)
    return reply.status(200).send({ mensagem: 'Delegado com sucesso' })
}

export const submeterProjetoHandler = async (request: any, reply: any) => {
    const { codProjeto } = request.body
    await projetoService.submeter(codProjeto)
    return reply.status(200).send({ mensagem: 'Projeto submetido com sucesso.' })
}

export const listarTiposProjetoHandler = async (request: any, reply: any) => {
    const tipos = await projetoService.listarTiposProjeto()
    return reply.status(200).send(tipos)
}

export const listarDetalhesModeloHandler = async (request: any, reply: any) => {
    const { codTipoProjeto } = request.params
    const detalhes = await projetoService.listarDetalhesModelo(codTipoProjeto)
    if (!detalhes) return reply.status(404).send({ error: 'Modelo não encontrado' })
    return reply.status(200).send(detalhes)
}

export const listarProjetosSalvosHandler = async (request: any, reply: any) => {
    const projetos = await projetoService.listarSalvosPorEntExec()
    return reply.status(200).send(projetos)
}

export const listarProjetosSubmetidosHandler = async (request: any, reply: any) => {
    const projetos = await projetoService.listarSubmetidosPorEntExec()
    return reply.status(200).send(projetos)
}

export const getSaldoHandler = async (request: any, reply: any) => {
    const { codProjeto } = request.params
    try {
        const saldo = await projetoService.getSaldo(codProjeto)
        return reply.status(200).send(saldo)
    } catch (error: any) {
        return reply.status(404).send({ error: error.message })
    }
}

import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { Perfil, verificarPermissao } from '../../middlewares/auth'
import {
    createProjetoHandler,
    deleteProjetoHandler,
    delegarEntExecEntGerHandler,
    getProjetoHandler,
    listarDetalhesModeloHandler,
    listarProjetosAprovadosHandler,
    listarProjetosSalvosHandler,
    listarProjetosSubmetidosHandler,
    listarTiposProjetoHandler,
    submeterProjetoHandler,
    updateProjetoHandler,
    getSaldoHandler
} from './projeto.controller'
import { projetoSchemas } from './projeto.schema'

export const projetoRoutes: FastifyPluginAsyncZod = async app => {
    app.get(
        '/api/projetos/aprovados',
        {
            preHandler: verificarPermissao([
                Perfil.ENT_DEL_TEC,
                Perfil.ENTIDADE_EXECUTORA,
                Perfil.ENT_GER,
            ]),
            schema: {
                summary: 'Listar projetos aprovados por entidade',
                tags: ['Projeto'],
                ...projetoSchemas.listarAprovados,
            },
        },
        listarProjetosAprovadosHandler
    )

    app.post(
        '/api/projetos',
        {
            preHandler: verificarPermissao([Perfil.ENT_DEL_TEC, Perfil.ENTIDADE_EXECUTORA]),
            schema: projetoSchemas.create
        },
        createProjetoHandler
    )

    app.put(
        '/api/projetos/:codProjeto',
        {
            preHandler: verificarPermissao([Perfil.ENT_DEL_TEC, Perfil.ENTIDADE_EXECUTORA]),
            schema: projetoSchemas.update
        },
        updateProjetoHandler
    )

    app.delete(
        '/api/projetos/:codProjeto',
        {
            preHandler: verificarPermissao([Perfil.ENT_DEL_TEC]),
            schema: projetoSchemas.delete
        },
        deleteProjetoHandler
    )

    app.get(
        '/api/projetos/:codProjeto',
        {
            preHandler: verificarPermissao([Perfil.ENT_DEL_TEC, Perfil.ENTIDADE_EXECUTORA, Perfil.ENT_GER]),
            schema: projetoSchemas.get
        },
        getProjetoHandler
    )

    app.put('/api/projetos/submetidos/:codProjeto', { preHandler: verificarPermissao(Perfil.ENT_DEL_TEC) }, delegarEntExecEntGerHandler)
    app.put('/api/projetos/submeter', {}, submeterProjetoHandler)
    app.get('/api/tipos-projeto', { preHandler: verificarPermissao(Perfil.ENT_DEL_TEC) }, listarTiposProjetoHandler)
    app.get('/api/tipos-projeto/:codTipoProjeto', {
        preHandler: verificarPermissao(Perfil.ENT_DEL_TEC),
        schema: projetoSchemas.listarDetalhesModelo
    }, listarDetalhesModeloHandler)
    app.get('/api/projetos/salvos', { preHandler: verificarPermissao(Perfil.ENT_DEL_TEC) }, listarProjetosSalvosHandler)
    app.get('/api/projetos/submetidos', { preHandler: verificarPermissao(Perfil.ENT_DEL_TEC) }, listarProjetosSubmetidosHandler)

    app.get(
        '/api/projetos/:codProjeto/saldo',
        {
            preHandler: verificarPermissao([
                Perfil.ENT_DEL_TEC,
                Perfil.ENTIDADE_EXECUTORA,
                Perfil.ENT_GER,
                Perfil.ENT_DEL_FIN
            ]),
            schema: projetoSchemas.getSaldo
        },
        getSaldoHandler
    )
}

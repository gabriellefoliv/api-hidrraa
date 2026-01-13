import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { Perfil, verificarPermissao } from '../../middlewares/auth'
import {
    excluirEvidenciaHandler,
    getProjectForExecutionHandler,
    listarEvidenciasHandler,
    solicitarFinanciamentoHandler,
    submeterEvidenciasHandler,
    uploadEvidenciaHandler
} from './execucao-marco.controller'
import { execucaoMarcoSchemas } from './execucao-marco.schema'

export const execucaoMarcoRoutes: FastifyPluginAsyncZod = async app => {
    app.get(
        '/api/projetos/:codProjeto/executavel',
        {
            preHandler: verificarPermissao([Perfil.ENTIDADE_EXECUTORA, Perfil.ENT_GER]),
            schema: {
                summary: 'Buscar projeto executável por id',
                tags: ['Projeto'],
                ...execucaoMarcoSchemas.buscarProjetoExecutavel
            }
        },
        getProjectForExecutionHandler
    )

    app.put(
        '/api/evidencias/submeter',
        {
            preHandler: verificarPermissao([Perfil.ENTIDADE_EXECUTORA]),
            schema: {
                summary: 'Submeter Evidências',
                tags: ['Evidências'],
                ...execucaoMarcoSchemas.submeterEvidencias
            }
        },
        submeterEvidenciasHandler
    )

    app.post(
        '/api/evidencias/upload',
        {
            preHandler: verificarPermissao([Perfil.ENTIDADE_EXECUTORA]),
        },
        uploadEvidenciaHandler
    )



    app.delete(
        '/api/evidencias/:codEvidenciaApresentada',
        {
            preHandler: verificarPermissao([Perfil.ENTIDADE_EXECUTORA]),
            schema: {
                summary: 'Excluir evidência apresentada',
                tags: ['Projeto'],
                ...execucaoMarcoSchemas.excluirEvidencia
            }
        },
        excluirEvidenciaHandler
    )

    app.get(
        '/api/evidencias/:codProjeto/:codExecucaoMarco',
        {
            preHandler: verificarPermissao([Perfil.ENTIDADE_EXECUTORA, Perfil.ENT_GER]),
            schema: {
                summary: 'Listar evidências por marco',
                tags: ['Evidência'],
                ...execucaoMarcoSchemas.listarEvidenciasPorMarco
            }
        },
        listarEvidenciasHandler
    )

    app.post(
        '/api/financiamento/solicitar',
        {
            preHandler: verificarPermissao([Perfil.ENTIDADE_EXECUTORA]),
            schema: {
                summary: 'Solicitar financiamento',
                tags: ['Financiamento'],
                ...execucaoMarcoSchemas.solicitarFinanciamento
            }
        },
        solicitarFinanciamentoHandler
    )
}

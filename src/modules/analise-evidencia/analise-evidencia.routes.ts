import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { Perfil, verificarPermissao } from '../../middlewares/auth'
import {
    listarMarcosCompletosHandler,
    listarProjetosComEvidenciasHandler,
    validarEvidenciasHandler,
    getProjectWithEvaluatedMilestonesHandler
} from './analise-evidencia.controller'
import { analiseEvidenciaSchemas } from './analise-evidencia.schema'

export const analiseEvidenciaRoutes: FastifyPluginAsyncZod = async app => {
    app.patch(
        '/api/marco/:codExecucaoMarco/validar',
        {
            preHandler: verificarPermissao([Perfil.ENT_DEL_TEC]),
            schema: {
                summary: 'Validar evidências',
                tags: ['Evidência'],
                ...analiseEvidenciaSchemas.validarEvidencias
            }
        },
        validarEvidenciasHandler
    )

    app.get(
        '/api/projetos/com-evidencias',
        {
            preHandler: verificarPermissao([Perfil.ENT_DEL_TEC]),
            schema: {
                summary: 'Listar projetos com evidências',
                tags: ['Projeto'],
                ...analiseEvidenciaSchemas.listarProjetosComEvidencias
            }
        },
        listarProjetosComEvidenciasHandler
    )

    app.get(
        '/api/marcos/:codProjeto/completos',
        {
            preHandler: verificarPermissao([Perfil.ENT_DEL_TEC]),
            schema: {
                summary: 'Listar marcos completos',
                tags: ['Evidência'],
                ...analiseEvidenciaSchemas.listarMarcosCompletos
            }
        },
        listarMarcosCompletosHandler
    )

    app.get(
        '/api/evidencias/:codProjeto/avaliadas',
        {
            preHandler: verificarPermissao([Perfil.ENTIDADE_EXECUTORA, Perfil.ENT_DEL_TEC, Perfil.ENT_GER]),
            schema: {
                summary: 'Listar evidências avaliadas de um projeto',
                tags: ['Evidência'],
                ...analiseEvidenciaSchemas.listarMarcosAvaliados
            }
        },
        getProjectWithEvaluatedMilestonesHandler
    )
}

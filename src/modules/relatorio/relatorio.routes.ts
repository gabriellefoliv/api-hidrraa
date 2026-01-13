import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { Perfil, verificarPermissao } from '../../middlewares/auth'
import {
    listarEvidenciasSubmetidasHandler,
    uploadRelatorioHandler
} from './relatorio.controller'
import { relatorioSchemas } from './relatorio.schema'

export const relatorioRoutes: FastifyPluginAsyncZod = async app => {
    app.post(
        '/api/relatorios/upload',
        {
            preHandler: verificarPermissao([Perfil.ENT_GER]),
        },
        uploadRelatorioHandler
    )

    app.get(
        '/api/evidencias/:codProjeto/submetidas/:codExecucaoMarco',
        {
            preHandler: verificarPermissao([Perfil.ENTIDADE_EXECUTORA, Perfil.ENT_GER]),
            schema: {
                summary: 'Listar evidências submetidas',
                tags: ['Evidência'],
                ...relatorioSchemas.listarEvidenciasSubmetidas
            }
        },
        listarEvidenciasSubmetidasHandler
    )
}

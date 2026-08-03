import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { Perfil, verificarPermissao } from '../../middlewares/auth'
import {
    listarEvidenciasSubmetidasHandler,
    uploadRelatorioHandler,
    getFinancialReportHandler
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

    app.get(
        '/api/relatorios/financeiro/:codInvestidor',
        {
            preHandler: verificarPermissao([Perfil.INVESTIDOR]),
            schema: {
                summary: 'Obter relatório financeiro de rastreabilidade',
                tags: ['Relatórios'],
                params: z.object({
                    codInvestidor: z.coerce.number(),
                }),
            }
        },
        getFinancialReportHandler
    )
}

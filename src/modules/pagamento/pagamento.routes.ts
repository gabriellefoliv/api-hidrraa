import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { Perfil, verificarPermissao } from '../../middlewares/auth'
import {
    confirmPaymentWithAllocationHandler,
    confirmSimplePaymentHandler,
    getPaymentTransactionHandler,
    getSaldosAportesHandler,
    listEvidencesWithRequestsHandler,
    listProjectsWithRequestsHandler
} from './pagamento.controller'
import { pagamentoSchemas } from './pagamento.schema'

export const pagamentoRoutes: FastifyPluginAsyncZod = async app => {
    app.post(
        '/api/pagamentos/:codPagtoMarco/confirmar-com-alocacao',
        {
            preHandler: verificarPermissao([Perfil.ENT_DEL_FIN]),
            schema: {
                summary: 'Confirmar pagamento com alocação automática',
                tags: ['Pagamento'],
                ...pagamentoSchemas.confirmarPagamento
            }
        },
        confirmPaymentWithAllocationHandler
    )

    app.post(
        '/api/pagamentos/:codPagtoMarco/confirmar',
        {
            preHandler: verificarPermissao([Perfil.ENT_DEL_FIN]),
            schema: {
                summary: 'Confirmar pagamento (Simples)',
                tags: ['Pagamento'],
                ...pagamentoSchemas.confirmarPagamento
            }
        },
        confirmSimplePaymentHandler
    )

    app.get(
        '/api/aportes/saldos',
        {
            preHandler: verificarPermissao([Perfil.ENT_DEL_FIN, Perfil.ENT_GER]),
            schema: {
                summary: 'Saldos de aportes',
                tags: ['Pagamento'],
            }
        },
        getSaldosAportesHandler
    )

    app.get(
        '/api/pagamentos/:codPagtoMarco/transacao',
        {
            preHandler: verificarPermissao([Perfil.ENT_DEL_FIN]),
            schema: {
                summary: 'Transação de pagamento',
                tags: ['Pagamento'],
                ...pagamentoSchemas.getTransacao
            }
        },
        getPaymentTransactionHandler
    )

    app.get(
        '/api/pagamentos',
        {
            preHandler: verificarPermissao([Perfil.ENT_DEL_TEC, Perfil.ENT_DEL_FIN]),
            schema: {
                summary: 'Listar projetos com solicitações',
                tags: ['Pagamento'],
                ...pagamentoSchemas.listarProjetos
            }
        },
        listProjectsWithRequestsHandler
    )

    app.get(
        '/api/pagamentos/:codProjeto',
        {
            preHandler: verificarPermissao([Perfil.ENTIDADE_EXECUTORA, Perfil.ENT_GER, Perfil.ENT_DEL_FIN]),
            schema: {
                summary: 'Listar evidências com solicitações',
                tags: ['Pagamento'],
                ...pagamentoSchemas.listarEvidencias
            }
        },
        listEvidencesWithRequestsHandler
    )
}

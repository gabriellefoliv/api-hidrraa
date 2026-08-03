import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { Perfil, verificarPermissao } from '../../middlewares/auth'
import {
    createPaymentIntentHandler,
    getRastreabilidadeHandler,
    handleStripeWebhookHandler,
    listarAportesHandler,
    listarAportesRealizadosHandler,
    validarAporteHandler,
} from './aporte.controller'
import { aporteSchemas } from './aporte.schema'

export const aporteRoutes: FastifyPluginAsyncZod = async app => {
    app.post(
        '/api/criar-payment-intent',
        {
            preHandler: verificarPermissao(Perfil.INVESTIDOR),
            schema: {
                summary: 'Criar uma intenção de pagamento para Aporte',
                tags: ['Aporte'],
                ...aporteSchemas.createPaymentIntent,
            },
        },
        createPaymentIntentHandler
    )

    app.post(
        '/api/aportes',
        {
            config: {
                rawBody: true
            }
        },
        handleStripeWebhookHandler
    )

    app.get(
        '/api/aportes/:codInvestidor',
        {
            preHandler: verificarPermissao(Perfil.INVESTIDOR),
            schema: {
                summary: 'Listar aportes realizados por Investidor',
                tags: ['Aporte'],
                ...aporteSchemas.listarAportesRealizados,
            },
        },
        listarAportesRealizadosHandler
    )

    app.get(
        '/api/aportes',
        {
            preHandler: verificarPermissao([Perfil.ENT_DEL_TEC, Perfil.ENT_GER]),
            schema: {
                summary: 'Listar todos os aportes (Admin/Tech)',
                tags: ['Aporte'],
                ...aporteSchemas.listarAportes,
            },
        },
        listarAportesHandler
    )

    app.get(
        '/api/aportes/:codAporte/rastreabilidade',
        {
            preHandler: verificarPermissao([Perfil.INVESTIDOR, Perfil.ENT_DEL_FIN, Perfil.ENT_DEL_TEC]),
            schema: {
                summary: 'Obter rastreabilidade de um aporte',
                tags: ['Aporte'],
                ...aporteSchemas.getRastreabilidade
            }
        },
        getRastreabilidadeHandler
    )

    app.patch(
        '/api/aportes/:codAporte',
        {
            preHandler: verificarPermissao(Perfil.ENT_DEL_TEC),
            schema: {
                summary: 'Validar aporte',
                tags: ['Aporte'],
                ...aporteSchemas.validarAporte,
            },
        },
        validarAporteHandler
    )
}

import { env } from '../../env'
import { aporteService } from './aporte.service'

export const createPaymentIntentHandler = async (request: any, reply: any) => {
    const { amount } = request.body
    const { codUsuario } = request.user

    try {
        const paymentIntent = await aporteService.createPaymentIntent(amount, codUsuario)
        return reply.status(201).send({ clientSecret: paymentIntent.client_secret ?? '' })
    } catch (error: any) {
        return reply.status(400).send({ error: error.message })
    }
}

export const handleStripeWebhookHandler = async (request: any, reply: any) => {
    const sig = request.headers['stripe-signature'] as string
    const webhookSecret = env.STRIPE_WEBHOOK_SECRET

    try {
        const result = await aporteService.handleStripeWebhook(request.rawBody, sig, webhookSecret)
        return reply.status(200).send(result)
    } catch (error: any) {
        return reply.status(400).send(`Webhook Error: ${error.message}`)
    }
}

export const listarAportesRealizadosHandler = async (request: any, reply: any) => {
    const { codInvestidor } = request.params
    try {
        const result = await aporteService.listarAportesRealizados(codInvestidor)
        return reply.status(200).send(result)
    } catch (error: any) {
        return reply.status(409).send({ error: 'Erro ao listar aportes' })
    }
}

export const listarAportesHandler = async (request: any, reply: any) => {
    try {
        const result = await aporteService.listarAportes()
        return reply.status(200).send(result)
    } catch (error: any) {
        return reply.status(404).send({ error: 'Aporte não encontrado.' })
    }
}

export const validarAporteHandler = async (request: any, reply: any) => {
    const { codAporte } = request.params
    try {
        const result = await aporteService.validarAporte(codAporte)
        return reply.status(200).send(result)
    } catch (error: any) {
        return reply.status(404).send({ error: 'Aporte não encontrado.' })
    }
}

export const getRastreabilidadeHandler = async (request: any, reply: any) => {
    const { codAporte } = request.params
    try {
        const result = await aporteService.getRastreabilidade(codAporte)
        return reply.send(result)
    } catch (error: any) {
        return reply.status(404).send({ error: error.message })
    }
}

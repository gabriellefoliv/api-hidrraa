import type { FastifyPluginAsync } from 'fastify'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import Stripe from 'stripe'
import z from 'zod'
import { env } from '../../env'
import { realizarAporte } from '../../functions/investidor/realizar-aporte'
import { registrarAporteBlockchain } from '../../functions/investidor/registrar-aporte-blockchain'
import { Perfil, verificarPermissao } from '../../middlewares/auth'

const stripe = new Stripe(env.STRIPE_SECRET_KEY)

export const criarPaymentIntentRoute: FastifyPluginAsyncZod = async app => {
  app.post(
    '/api/criar-payment-intent',
    {
      preHandler: verificarPermissao(Perfil.INVESTIDOR),
      schema: {
        summary: 'Criar uma intenção de pagamento para Aporte',
        tags: ['Aporte'],
        body: z.object({
          amount: z.number().min(50),
        }),
        response: {
          201: z.object({
            clientSecret: z.string(),
          }),
          400: z.object({
            error: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { amount } = request.body
      const { codUsuario } = request.user as { codUsuario: number }

      try {
        const paymentIntent = await stripe.paymentIntents.create({
          amount,
          currency: 'brl',
          automatic_payment_methods: {
            enabled: true,
          },
          metadata: {
            codUsuario: codUsuario.toString(),
          },
        })

        return reply.status(201).send({
          clientSecret: paymentIntent.client_secret ?? '',
        })
      } catch (error) {
        console.error('Stripe Error:', error)
        return reply.status(400).send({ error: (error as Error).message })
      }
    }
  )
}

export const realizarAporteRoute: FastifyPluginAsync = async app => {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  app.post('/api/aportes', async (request: any, reply) => {
    const sig = request.headers['stripe-signature'] as string
    const webhookSecret = env.STRIPE_WEBHOOK_SECRET

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(
        request.rawBody,
        sig,
        webhookSecret
      )
    } catch (err) {
      console.error(
        'Webhook signature verification failed.',
        (err as Error).message
      )
      return reply.status(400).send(`Webhook Error: ${(err as Error).message}`)
    }

    console.log(`🔔 Webhook received: ${event.type}`)

    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        console.log('💰 Payment Intent Succeeded:', paymentIntent.id)

        const amount = paymentIntent.amount
        const codUsuarioStr = paymentIntent.metadata.codUsuario
        console.log('👤 Metadata codUsuario:', codUsuarioStr)

        const codUsuario = Number.parseInt(codUsuarioStr, 10)
        const stripePaymentIntentId = paymentIntent.id

        if (!codUsuario) {
          console.error(
            'Webhook: codUsuario não encontrado no metadata do PaymentIntent'
          )
          return reply.status(200).send({ received: true })
        }

        try {
          console.log('💾 Saving to DB (realizarAporte)...')
          const { aporteId } = await realizarAporte({
            codUsuario,
            bc_valor: amount,
          })
          console.log('✅ Aporte saved. ID:', aporteId)

          console.log('🔗 Registering on Blockchain...')
          await registrarAporteBlockchain({
            codUsuario,
            bc_valor: amount,
            aporteId,
            stripePaymentIntentId,
          })
          console.log('✅ Blockchain registration complete.')
        } catch (error) {
          console.error('❌ Erro ao processar aporte do webhook:', error)
          return reply.status(500).send({ error: (error as Error).message })
        }
        break
      }

      default:
        console.log(`Unhandled event type ${event.type}`)
    }
    return reply.status(200).send({ received: true })
  })
}

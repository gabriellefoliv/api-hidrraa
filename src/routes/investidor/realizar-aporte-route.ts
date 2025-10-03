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

      try {
        const paymentIntent = await stripe.paymentIntents.create({
          amount,
          currency: 'brl',
          automatic_payment_methods: {
            enabled: true,
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

export const realizarAporteRoute: FastifyPluginAsyncZod = async app => {
  app.post(
    '/api/aportes',
    {
      preHandler: verificarPermissao(Perfil.INVESTIDOR),
      schema: {
        summary: 'Registrar Aporte Após Pagamento Bem-sucedido',
        tags: ['Aporte'],
        body: z.object({
          bc_valor: z.number(),
        }),
        response: {
          201: z.object({
            aporteId: z.number(),
          }),
          409: z.object({
            error: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { bc_valor } = request.body
      const { codUsuario } = request.user as { codUsuario: number }

      if (!codUsuario) {
        return reply.status(401).send({ error: 'Usuário não autenticado' })
      }

      try {
        const { aporteId } = await realizarAporte({
          codUsuario,
          bc_valor,
        })
        const { transactionId } = await registrarAporteBlockchain({
          codUsuario,
          bc_valor,
          aporteId,
        })

        return reply.status(201).send({ aporteId })
      } catch (error) {
        return reply.status(409).send({ error: (error as Error).message })
      }
    }
  )
}

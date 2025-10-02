import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { cadastrarEntidadeDelegatariaFinanceira } from '../../functions/auth/cadastrar-ent-del-fin'

export const cadastrarEntidadeDelegatariaFinanceiraRoute: FastifyPluginAsyncZod =
  async app => {
    app.post(
      '/api/entdelfin/cadastro',
      {
        schema: {
          summary: 'Cadastro de Entidade Delegatária Financeira',
          tags: ['Autenticação'],
          body: z.object({
            nome: z.string(),
            email: z.string().email(),
            senha: z.string().min(6),
            codCBH: z.number(),
          }),
          response: {
            201: z.object({
              codUsuario: z.number(),
            }),
            409: z.object({
              error: z.string(),
            }),
          },
        },
      },
      async (request, reply) => {
        try {
          const { nome, email, senha, codCBH } = request.body

          const { codUsuario } = await cadastrarEntidadeDelegatariaFinanceira({
            nome,
            email,
            senha,
            codCBH,
          })
          return reply.status(201).send({ codUsuario })
        } catch (error) {
          if (
            error instanceof Error &&
            error.message === 'Usuário já existe no sistema.'
          ) {
            return reply.status(409).send({ error: error.message })
          }
          return reply.status(500).send({ error: 'Erro do servidor.' })
        }
      }
    )
  }

import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { cadastrarEntidadeGerenciadora } from '../../functions/auth/cadastrar-entidade-gerenciadora'

export const cadastrarEntidadeGerenciadoraRoute: FastifyPluginAsyncZod =
  async app => {
    app.post(
      '/api/entGer/cadastro',
      {
        schema: {
          summary: 'Cadastro de Entidade Gerenciadora',
          tags: ['Autenticação'],
          body: z.object({
            nome: z.string(),
            email: z.string().email(),
            senha: z.string().min(6),
            codCBH: z.number(),
            cnpjcpf: z.string(),
            contato: z.string(),
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
          const { nome, email, senha, codCBH, cnpjcpf, contato } = request.body

          const { codUsuario } = await cadastrarEntidadeGerenciadora({
            nome,
            email,
            senha,
            codCBH,
            cnpjcpf,
            contato,
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

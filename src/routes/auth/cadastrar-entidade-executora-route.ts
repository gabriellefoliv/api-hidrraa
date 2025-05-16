import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { cadastrarEntidadeExecutora } from '../../functions/auth/cadastrar-entidade-executora'

export const cadastrarEntidadeExecutoraRoute: FastifyPluginAsyncZod =
  async app => {
    app.post(
      '/api/entExec/cadastro',
      {
        schema: {
          summary: 'Cadastro de Entidade Executora',
          tags: ['Autenticação'],
          body: z.object({
            nome: z.string(),
            email: z.string().email(),
            senha: z.string().min(6),
            codCBH: z.number(),
            cnpjcpf: z.number(),
            especialidade: z.string(),
            contato: z.number(),
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
          const {
            nome,
            email,
            senha,
            codCBH,
            cnpjcpf,
            contato,
            especialidade,
          } = request.body

          const { codUsuario } = await cadastrarEntidadeExecutora({
            nome,
            email,
            senha,
            codCBH,
            cnpjcpf,
            contato,
            especialidade,
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

import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { cadastrarInvestidor } from '../../functions/auth/cadastrar-investidor'

export const cadastrarInvestidorRoute: FastifyPluginAsyncZod = async app => {
  app.post(
    '/api/investidor/cadastro',
    {
      schema: {
        summary: 'Cadastro de Investidor ESG',
        tags: ['Autenticação'],
        body: z.object({
          nome: z.string(),
          email: z.string().email(),
          senha: z.string().min(6),
          codCBH: z.number(),
          cnpj: z.number(),
          razaoSocial: z.string(),
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
        const { nome, email, senha, codCBH, razaoSocial, cnpj, contato } =
          request.body

        const { codUsuario } = await cadastrarInvestidor({
          nome,
          email,
          senha,
          codCBH,
          razaoSocial,
          cnpj,
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

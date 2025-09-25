import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { buscarInvestidorPorCodUsuario } from '../../functions/auth/buscar-investidor-por-codUsuario'
import { Perfil, verificarPermissao } from '../../middlewares/auth'

export const buscarInvestidorPorCodUsuarioRoute: FastifyPluginAsyncZod =
  async app => {
    app.get(
      '/api/investidor/:codUsuario',
      {
        preHandler: verificarPermissao(Perfil.INVESTIDOR),
        schema: {
          summary: 'Buscar Investidor por Código de Usuário',
          tags: ['Autenticação'],
          params: z.object({
            codUsuario: z.coerce.number(),
          }),
          response: {
            200: z.object({
              codInvestidor: z.number(),
              razaoSocial: z.string(),
              cnpj: z.string(),
              contato: z.string(),
              codUsuario: z.number(),
            }),
            404: z.object({
              error: z.string(),
            }),
          },
        },
      },
      async (request, reply) => {
        try {
          const { codUsuario } = request.params

          const inv = await buscarInvestidorPorCodUsuario(codUsuario)

          return reply.status(200).send(inv)
        } catch (error) {
          if (
            error instanceof Error &&
            error.message ===
              'Entidade executora não encontrada para este usuário.'
          ) {
            return reply.status(404).send({ error: error.message })
          }

          return reply.status(500).send({ error: 'Erro do servidor.' })
        }
      }
    )
  }

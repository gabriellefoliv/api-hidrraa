import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { buscarEntidadeGerenciadoraPorCodUsuario } from '../../functions/auth/buscar-ent-ger-por-codUsuario'
import { buscarInvestidorPorCodUsuario } from '../../functions/auth/buscar-investidor-por-codUsuario'
import { Perfil, verificarPermissao } from '../../middlewares/auth'

export const buscarEntGerPorCodUsuarioRoute: FastifyPluginAsyncZod =
  async app => {
    app.get(
      '/api/entGer/:codUsuario',
      {
        preHandler: verificarPermissao(Perfil.ENT_GER),
        schema: {
          summary: 'Buscar Entidade Gerenciadora por Código de Usuário',
          tags: ['Autenticação'],
          params: z.object({
            codUsuario: z.coerce.number(),
          }),
          response: {
            200: z.object({
              codEntGer: z.number(),
              nome: z.string(),
              cnpjcpf: z.string(),
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

          const ger = await buscarEntidadeGerenciadoraPorCodUsuario(codUsuario)

          return reply.status(200).send(ger)
        } catch (error) {
          if (
            error instanceof Error &&
            error.message ===
              'Entidade gerenciadora não encontrada para este usuário.'
          ) {
            return reply.status(404).send({ error: error.message })
          }

          return reply.status(500).send({ error: 'Erro do servidor.' })
        }
      }
    )
  }

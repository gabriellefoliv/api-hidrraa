import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { buscarEntExecPorCodUsuario } from '../../functions/auth/buscar-entExec-por-codUsuario'
import { Perfil, verificarPermissao } from '../../middlewares/auth'

export const buscarEntExecPorCodUsuarioRoute: FastifyPluginAsyncZod =
  async app => {
    app.get(
      '/api/entExec/:codUsuario',
      {
        preHandler: verificarPermissao(Perfil.ENTIDADE_EXECUTORA),
        schema: {
          summary: 'Buscar Entidade Executora por Código de Usuário',
          tags: ['Autenticação'],
          params: z.object({
            codUsuario: z.coerce.number(),
          }),
          response: {
            200: z.object({
              codEntExec: z.number(),
              nome: z.string(),
              cnpjcpf: z.string(),
              especialidade: z.string(),
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

          const ent = await buscarEntExecPorCodUsuario(codUsuario)

          return reply.status(200).send(ent)
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

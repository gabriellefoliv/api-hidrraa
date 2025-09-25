import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { ListarEntExecs } from '../../functions/auth/listar-entExecs'
import { Perfil, verificarPermissao } from '../../middlewares/auth'

export const listarEntExecsRoute: FastifyPluginAsyncZod = async app => {
  app.get(
    '/api/entExecs',
    {
      preHandler: verificarPermissao(Perfil.ENT_DEL_TEC),
      schema: {
        summary: 'Listar Entidades Executoras',
        tags: ['Autenticação'],
        response: {
          200: z.array(
            z.object({
              codEntExec: z.number(),
              nome: z.string(),
            })
          ),
          404: z.object({
            error: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      try {
        const ents = await ListarEntExecs()

        return reply.status(200).send(ents)
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

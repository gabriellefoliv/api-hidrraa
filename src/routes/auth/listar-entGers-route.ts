import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { ListarEntGers } from '../../functions/auth/listar-entGers'
import { Perfil, verificarPermissao } from '../../middlewares/auth'

export const listarEntGersRoute: FastifyPluginAsyncZod = async app => {
  app.get(
    '/api/entGers',
    {
      preHandler: verificarPermissao(Perfil.ENT_DEL_TEC),
      schema: {
        summary: 'Listar Entidades Gerenciadoras',
        tags: ['Autenticação'],
        response: {
          200: z.array(
            z.object({
              codEntGer: z.number(),
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
        const gers = await ListarEntGers()

        return reply.status(200).send(gers)
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

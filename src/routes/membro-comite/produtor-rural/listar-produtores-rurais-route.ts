import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { listarProdutoresRurais } from '../../../functions/membro-comite/produtor-rural/listar-produtores-rurais'
import { Perfil, verificarPermissao } from '../../../middlewares/auth'

export const listarProdutoresRuraisRoute: FastifyPluginAsyncZod = async app => {
  app.get(
    '/api/produtores',
    {
      preHandler: verificarPermissao([
        Perfil.MEMBRO_COMITE,
        Perfil.ENTIDADE_EXECUTORA,
      ]),
      schema: {
        summary: 'Listar Produtores Rurais',
        tags: ['Produtor Rural'],
        response: {
          200: z.array(
            z.object({
              codProdutor: z.number(),
              nome: z.string(),
              cpf: z.number(),
              contato: z.number(),
              codCBH: z.number(),
            })
          ),
          409: z.object({
            error: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const produtores = await listarProdutoresRurais()

      return reply.status(201).send(produtores)
    }
  )
}

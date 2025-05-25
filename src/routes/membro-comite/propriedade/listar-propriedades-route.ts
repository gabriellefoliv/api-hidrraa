import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { listarPropriedades } from '../../../functions/membro-comite/propriedade/listar-propriedades'
import { Perfil, verificarPermissao } from '../../../middlewares/auth'

export const listarPropriedadesRoute: FastifyPluginAsyncZod = async app => {
  app.get(
    '/api/propriedades',
    {
      preHandler: verificarPermissao([
        Perfil.MEMBRO_COMITE,
        Perfil.ENTIDADE_EXECUTORA,
      ]),
      schema: {
        summary: 'Listar propriedades',
        tags: ['Propriedade'],
        response: {
          200: z.array(
            z.object({
              codPropriedade: z.number(),
              logradouro: z.string(),
              numero: z.number(),
              complemento: z.string(),
              cep: z.number(),
              bairro: z.string(),
              cidade: z.string(),
              uf: z.string(),
              codProdutor: z.number(),
              CodMicroBacia: z.number(),
            })
          ),
          409: z.object({
            error: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const propriedades = await listarPropriedades()

      return reply.status(201).send(propriedades)
    }
  )
}

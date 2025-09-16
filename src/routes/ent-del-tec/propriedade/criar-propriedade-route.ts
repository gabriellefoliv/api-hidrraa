import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { criarPropriedade } from '../../../functions/ent-del-tec/propriedade/criar-propriedade'
import { Perfil, verificarPermissao } from '../../../middlewares/auth'

export const criarPropriedadeRoute: FastifyPluginAsyncZod = async app => {
  app.post(
    '/api/propriedades',
    {
      preHandler: verificarPermissao(Perfil.ENT_DEL_TEC),
      schema: {
        summary: 'Criar propriedade',
        tags: ['Propriedade'],
        body: z.object({
          logradouro: z.string(),
          numero: z.number(),
          complemento: z.string(),
          cep: z.string(),
          bairro: z.string(),
          cidade: z.string(),
          uf: z.string(),
          CodMicroBacia: z.number(),
          codProdutor: z.number(),
        }),
        response: {
          201: z.object({
            propriedadeId: z.number(),
          }),
          409: z.object({
            error: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const {
        logradouro,
        numero,
        complemento,
        cep,
        bairro,
        cidade,
        uf,
        CodMicroBacia,
        codProdutor,
      } = request.body

      const { propriedadeId } = await criarPropriedade({
        logradouro,
        numero,
        complemento,
        cep,
        bairro,
        cidade,
        uf,
        CodMicroBacia,
        codProdutor,
      })
      return reply.status(201).send({ propriedadeId })
    }
  )
}

import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { atualizarPropriedade } from '../../../functions/membro-comite/propriedade/atualizar-propriedade'
import { Perfil, verificarPermissao } from '../../../middlewares/auth'

export const atualizarPropriedadeRoute: FastifyPluginAsyncZod = async app => {
  app.put(
    '/api/propriedades/:codPropriedade',
    {
      preHandler: verificarPermissao(Perfil.MEMBRO_COMITE),
      schema: {
        summary: 'Atualizar propriedade',
        tags: ['Propriedade'],
        params: z.object({
          codPropriedade: z.coerce.number(), // aceita "123" como string na URL
        }),
        body: z.object({
          logradouro: z.string(),
          complemento: z.string(),
          numero: z.number(),
          cep: z.number(),
          bairro: z.string(),
          cidade: z.string(),
          uf: z.string(),
          codProdutor: z.number(),
          CodMicroBacia: z.number(),
        }),
        response: {
          200: z.object({
            propriedade: z.object({
              logradouro: z.string(),
              complemento: z.string(),
              numero: z.number(),
              cep: z.number(),
              bairro: z.string(),
              cidade: z.string(),
              uf: z.string(),
              codProdutor: z.number(),
              CodMicroBacia: z.number(),
            }),
          }),
          409: z.object({
            error: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { codPropriedade } = request.params
      const {
        logradouro,
        complemento,
        numero,
        cep,
        bairro,
        uf,
        cidade,
        codProdutor,
        CodMicroBacia,
      } = request.body

      const { novaPropriedade } = await atualizarPropriedade({
        codProdutor,
        logradouro,
        complemento,
        numero,
        cep,
        bairro,
        uf,
        cidade,
        CodMicroBacia,
        codPropriedade,
      })
      return reply.status(201).send({ propriedade: novaPropriedade })
    }
  )
}

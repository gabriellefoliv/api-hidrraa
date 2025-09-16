import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { atualizarProdutorRural } from '../../../functions/ent-del-tec/produtor-rural/atualizar-produtor-rural'
import { Perfil, verificarPermissao } from '../../../middlewares/auth'

export const atualizarProdutorRuralRoute: FastifyPluginAsyncZod = async app => {
  app.put(
    '/api/produtores/:codProdutor',
    {
      preHandler: verificarPermissao(Perfil.ENT_DEL_TEC),
      schema: {
        summary: 'Atualizar produtor rural',
        tags: ['Produtor Rural'],
        params: z.object({
          codProdutor: z.coerce.number(), // aceita "123" como string na URL
        }),
        body: z.object({
          nome: z.string(),
          cpf: z.string(),
          contato: z.string(),
          codCBH: z.number(),
        }),
        response: {
          200: z.object({
            produtor: z.object({
              codProdutor: z.number(),
              nome: z.string(),
              cpf: z.string(),
              contato: z.string(),
              codCBH: z.number(),
            }),
          }),
          409: z.object({
            error: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { codProdutor } = request.params
      const { nome, cpf, contato, codCBH } = request.body

      const { novoProdutor } = await atualizarProdutorRural({
        codProdutor,
        nome,
        cpf,
        contato,
        codCBH,
      })
      return reply.status(201).send({ produtor: novoProdutor })
    }
  )
}

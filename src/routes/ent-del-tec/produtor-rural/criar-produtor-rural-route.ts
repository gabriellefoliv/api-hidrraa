import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { criarProdutorRural } from '../../../functions/ent-del-tec/produtor-rural/criar-produtor-rural'
import { Perfil, verificarPermissao } from '../../../middlewares/auth'

export const criarProdutorRuralRoute: FastifyPluginAsyncZod = async app => {
  app.post(
    '/api/produtores',
    {
      preHandler: verificarPermissao(Perfil.ENT_DEL_TEC),
      schema: {
        summary: 'Criar Produtor Rural',
        tags: ['Produtor Rural'],
        body: z.object({
          nome: z.string(),
          cpf: z.string(),
          contato: z.string(),
          codCBH: z.number(),
        }),
        response: {
          201: z.object({
            produtorRuralId: z.number(),
          }),
          409: z.object({
            error: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { nome, cpf, contato, codCBH } = request.body

      const { produtorRuralId } = await criarProdutorRural({
        nome,
        cpf,
        contato,
        codCBH,
      })
      return reply.status(201).send({ produtorRuralId })
    }
  )
}

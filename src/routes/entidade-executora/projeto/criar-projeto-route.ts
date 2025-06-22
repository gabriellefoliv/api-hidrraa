import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { criarProjeto } from '../../../functions/entidade-executora/projeto/criar-projeto'
import { Perfil, verificarPermissao } from '../../../middlewares/auth'

const marcoSchema = z.object({
  codMarcoRecomendado: z.number(),
  descricao: z.string(),
  descrDetAjustes: z.string().optional(),
  valorEstimado: z.number(),
  dataConclusao: z.coerce.date(),
})

export const criarProjetoRoute: FastifyPluginAsyncZod = async app => {
  app.post(
    '/api/projetos',
    {
      preHandler: verificarPermissao([Perfil.ENTIDADE_EXECUTORA]),
      schema: {
        summary: 'Criar novo projeto',
        tags: ['Projeto'],
        body: z.object({
          titulo: z.string(),
          objetivo: z.string(),
          acoes: z.string(),
          cronograma: z.string(),
          orcamento: z.number(),
          codPropriedade: z.number(),
          codTipoProjeto: z.number(),
          CodMicroBacia: z.number(),
          CodEntExec: z.number(),
          marcos: z.array(marcoSchema),
        }),
        response: {
          201: z.object({
            mensagem: z.string(),
            projetoId: z.number(),
          }),
        },
      },
    },
    async (request, reply) => {
      const data = request.body

      const resultado = await criarProjeto(data)

      return reply.status(201).send(resultado)
    }
  )
}

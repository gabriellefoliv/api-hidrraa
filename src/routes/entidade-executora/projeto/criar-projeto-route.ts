import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { criarProjeto } from '../../../functions/entidade-executora/projeto/criar-projeto'
import { Perfil, verificarPermissao } from '../../../middlewares/auth'

export const criarProjetoRoute: FastifyPluginAsyncZod = async app => {
  app.post(
    '/api/projetos',
    {
      preHandler: verificarPermissao(Perfil.ENTIDADE_EXECUTORA),
      schema: {
        summary: 'Criar Projeto',
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
          marcos: z.array(
            z.object({
              codMarcoRecomendado: z.number(),
              descricao: z.string(),
              valorEstimado: z.number(),
              dataConclusao: z.coerce.date(), // Data de conclusão é opcional
            })
          ),
        }),
        response: {
          201: z.object({
            projetoId: z.number(),
          }),
          409: z.object({
            error: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const {
        titulo,
        objetivo,
        acoes,
        cronograma,
        orcamento,
        codPropriedade,
        codTipoProjeto,
        CodMicroBacia,
        marcos,
      } = request.body

      const { codUsuario } = request.user as { codUsuario: number }
      if (!codUsuario) {
        return reply.status(401).send({ error: 'Usuário não autenticado' })
      }
      const { projetoId } = await criarProjeto({
        titulo,
        objetivo,
        acoes,
        cronograma,
        orcamento,
        codPropriedade,
        codTipoProjeto,
        CodMicroBacia,
        codUsuario,
        marcos,
      })
      return reply.status(201).send({ projetoId })
    }
  )
}

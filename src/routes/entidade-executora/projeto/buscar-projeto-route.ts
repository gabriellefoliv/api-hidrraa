import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { buscarProjeto } from '../../../functions/entidade-executora/projeto/buscar-projeto'
import { listarProjetosSalvosPorEntExec } from '../../../functions/entidade-executora/projeto/listar-projetos-salvos-por-ent-exec'
import { Perfil, verificarPermissao } from '../../../middlewares/auth'

export const buscarProjetoRoute: FastifyPluginAsyncZod = async app => {
  app.get(
    '/api/projetos/:codProjeto',
    {
      preHandler: verificarPermissao(Perfil.ENTIDADE_EXECUTORA),
      schema: {
        summary: 'Buscar projeto por id',
        tags: ['Projeto'],
        params: z.object({
          codProjeto: z.coerce.number(),
        }),
        response: {
          200: z.object({
            codProjeto: z.number(),
            titulo: z.string(),
            objetivo: z.string(),
            acoes: z.string(),
            cronograma: z.string(),
            orcamento: z.number(),
            codPropriedade: z.number().nullable(),
            dataSubmissao: z.date().nullable(),
            CodMicroBacia: z.number(),
            CodEntExec: z.number(),
            tipo_projeto: z.object({
              codTipoProjeto: z.number(),
              nome: z.string(),
              descricao: z.string(),
              execucao_marcos: z.array(
                z.object({
                  descricao: z.string(),
                  valorEstimado: z.number(),
                  dataConclusao: z.coerce.date(),
                })
              ),
            }),
          }),

          404: z.object({
            error: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { codProjeto } = request.params

      try {
        const projetos = await buscarProjeto({ codProjeto })
        return reply.status(200).send(projetos)
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      } catch (error: any) {
        return reply
          .status(404)
          .send({ error: error.message || 'Projeto não encontrado.' })
      }
    }
  )
}

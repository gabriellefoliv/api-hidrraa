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
            titulo: z.string().optional(),
            objetivo: z.string().optional(),
            acoes: z.string().optional(),
            cronograma: z.string().optional(),
            orcamento: z.number().optional(),
            codPropriedade: z.number().nullable(),
            dataSubmissao: z.date().nullable().optional(),
            CodMicroBacia: z.number(),
            CodEntExec: z.number(),
            tipo_projeto: z.object({
              codTipoProjeto: z.number(),
              nome: z.string().optional(),
              descricao: z.string().optional(),
              execucao_marcos: z.array(
                z.object({
                  codMarcoRecomendado: z.number(),
                  descricao: z.string().optional(),
                  valorEstimado: z.number().optional(),
                  dataConclusaoPrevista: z.coerce.date().optional(),
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
        const projeto = await buscarProjeto({ codProjeto })
        if (!projeto) {
          return reply.status(404).send({ error: 'Projeto não encontrado.' })
        }
        const formattedProjeto = {
          codProjeto: projeto.codProjeto,
          titulo: projeto.titulo ?? '',
          objetivo: projeto.objetivo ?? '',
          acoes: projeto.acoes ?? '',
          cronograma: projeto.cronograma ?? '',
          orcamento: projeto.orcamento ?? 0,
          codPropriedade: projeto.codPropriedade ?? null,
          dataSubmissao: projeto.dataSubmissao ?? null,
          CodMicroBacia: projeto.CodMicroBacia ?? 0,
          CodEntExec: projeto.CodEntExec ?? 0,
          tipo_projeto: {
            codTipoProjeto: projeto.tipo_projeto?.codTipoProjeto ?? 0,
            nome: projeto.tipo_projeto?.nome ?? '',
            descricao: projeto.tipo_projeto?.descricao ?? '',
            execucao_marcos: Array.isArray(
              projeto.tipo_projeto?.execucao_marcos
            )
              ? // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                projeto.tipo_projeto.execucao_marcos.map((marco: any) => ({
                  codMarcoRecomendado: marco.codMarcoRecomendado ?? 0,
                  descricao: marco.descricao ?? '',
                  valorEstimado: marco.valorEstimado ?? 0,
                  dataConclusaoPrevista: marco.dataConclusaoPrevista
                    ? new Date(marco.dataConclusaoPrevista)
                    : new Date(0),
                }))
              : [],
          },
        }
        return reply.status(200).send(formattedProjeto)
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      } catch (error: any) {
        return reply
          .status(404)
          .send({ error: error.message || 'Projeto não encontrado.' })
      }
    }
  )
}

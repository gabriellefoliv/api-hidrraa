import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { listarProjetosSalvosPorEntExec } from '../../../functions/membro-comite/projeto/listar-projetos-salvos-por-ent-exec'
import { Perfil, verificarPermissao } from '../../../middlewares/auth'

export const listarProjetosSalvosRoute: FastifyPluginAsyncZod = async app => {
  app.get(
    '/api/projetos/salvos',
    {
      preHandler: verificarPermissao(Perfil.MEMBRO_COMITE),
      schema: {
        summary: 'Listar projetos salvos por entidade executora',
        tags: ['Projeto'],
        response: {
          200: z.array(
            z.object({
              codProjeto: z.number(),
              titulo: z.string(),
              objetivo: z.string(),
              acoes: z.string(),
              cronograma: z.string(),
              orcamento: z.number(),
              codPropriedade: z.number().nullable(),
              CodMicroBacia: z.number(),
              tipo_projeto: z.object({
                codTipoProjeto: z.number(),
                nome: z.string(),
                descricao: z.string(),
                execucao_marcos: z.array(
                  z.object({
                    descricao: z.string(),
                    valorEstimado: z.number(),
                    dataConclusaoPrevista: z.coerce.date(),
                  })
                ),
              }),
              microbacia: z.object({
                codMicroBacia: z.number(),
                nome: z.string(),
              }),
            })
          ),
          404: z.object({
            error: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      try {
        const projetos = await listarProjetosSalvosPorEntExec()
        const formattedProjetos = projetos.map(proj => ({
          codProjeto: proj.codProjeto,
          titulo: proj.titulo ?? '',
          objetivo: proj.objetivo ?? '',
          acoes: proj.acoes ?? '',
          cronograma: proj.cronograma ?? '',
          orcamento: proj.orcamento ?? 0,
          codPropriedade: proj.codPropriedade ?? null,
          CodMicroBacia: proj.CodMicroBacia ?? 0,
          tipo_projeto: {
            codTipoProjeto: proj.tipo_projeto?.codTipoProjeto ?? 0,
            nome: proj.tipo_projeto?.nome ?? '',
            descricao: proj.tipo_projeto?.descricao ?? '',
            execucao_marcos: Array.isArray(proj.tipo_projeto?.execucao_marcos)
              ? // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                proj.tipo_projeto.execucao_marcos.map((marco: any) => ({
                  descricao: marco.descricao ?? '',
                  valorEstimado: marco.valorEstimado ?? 0,
                  dataConclusaoPrevista: marco.dataConclusaoPrevista
                    ? new Date(marco.dataConclusaoPrevista)
                    : new Date(0),
                }))
              : [],
          },
          microbacia: {
            codMicroBacia: proj.microbacia?.codMicroBacia ?? 0,
            nome: proj.microbacia?.nome ?? '',
          },
        }))
        return reply.status(200).send(formattedProjetos)
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      } catch (error: any) {
        return reply
          .status(404)
          .send({ error: error.message || 'Projeto não encontrado.' })
      }
    }
  )
}

import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { listarProjetosAvaliados } from '../../../functions/membro-comite/avaliacao/listar-projetos-avaliados'
import { Perfil, verificarPermissao } from '../../../middlewares/auth'

export const listarProjetosAvaliadosRoute: FastifyPluginAsyncZod =
  async app => {
    app.get(
      '/api/avaliacoes/avaliados',
      {
        preHandler: verificarPermissao(Perfil.MEMBRO_COMITE),
        schema: {
          summary: 'Listar projetos avaliados com detalhes',
          tags: ['Avaliação'],
          response: {
            200: z.array(
              z.object({
                codProjeto: z.number(),
                titulo: z.string(),
                objetivo: z.string(),
                acoes: z.string(),
                cronograma: z.string(),
                orcamento: z.number(),
                codPropriedade: z.number(),
                CodMicroBacia: z.number(),
                mediaPonderada: z.number().nullable(),
                tipo_projeto: z.object({
                  codTipoProjeto: z.number(),
                  nome: z.string(),
                  descricao: z.string(),
                  execucao_marcos: z.array(
                    z.object({
                      descricao: z.string(),
                      valorEstimado: z.number(),
                      dataConclusao: z.date(),
                    })
                  ),
                }),
                microbacia: z.object({
                  codMicroBacia: z.number().nullable(),
                  nome: z.string().nullable(),
                }),
                entidadeexecutora: z.object({
                  codEntExec: z.number().nullable(),
                  nome: z.string().nullable(),
                }),
              })
            ),
            500: z.object({
              error: z.string(),
            }),
          },
        },
      },
      async (request, reply) => {
        try {
          const projetos = await listarProjetosAvaliados()

          const formatted = projetos.map(proj => ({
            codProjeto: proj.codProjeto,
            titulo: proj.titulo ?? '',
            objetivo: proj.objetivo ?? '',
            acoes: proj.acoes ?? '',
            cronograma: proj.cronograma ?? '',
            orcamento: proj.orcamento ?? 0,
            codPropriedade: proj.codPropriedade ?? 0,
            CodMicroBacia: proj.CodMicroBacia ?? 0,
            mediaPonderada: proj.mediaPonderada,
            tipo_projeto: {
              ...proj.tipo_projeto,
              execucao_marcos: Array.isArray(proj.tipo_projeto?.execucao_marcos)
                ? // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                  proj.tipo_projeto.execucao_marcos.map((marco: any) => ({
                    descricao: marco.descricao ?? '',
                    valorEstimado: marco.valorEstimado ?? 0,
                    dataConclusao: marco.dataConclusao
                      ? new Date(marco.dataConclusao)
                      : new Date(0),
                  }))
                : [],
            },
            microbacia: {
              codMicroBacia: proj.microbacia?.codMicroBacia ?? null,
              nome: proj.microbacia?.nome ?? null,
            },
            entidadeexecutora: {
              codEntExec: proj.entidadeexecutora?.codEntExec ?? null,
              nome: proj.entidadeexecutora?.nome ?? null,
            },
          }))

          return reply.status(200).send(formatted)
        } catch (error) {
          console.error(error)
          return reply
            .status(500)
            .send({ error: 'Erro ao listar projetos avaliados' })
        }
      }
    )
  }

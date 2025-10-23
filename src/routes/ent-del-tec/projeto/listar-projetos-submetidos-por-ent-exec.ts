import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { listarProjetosSubmetidosPorEntExec } from '../../../functions/ent-del-tec/projeto/listar-projetos-submetidos-por-ent-exec'
import { Perfil, verificarPermissao } from '../../../middlewares/auth'

export const listarProjetosSubmetidosPorEntExecRoute: FastifyPluginAsyncZod =
  async app => {
    app.get(
      '/api/projetos/submetidos',
      {
        preHandler: verificarPermissao(Perfil.ENT_DEL_TEC),
        schema: {
          summary: 'Listar projeto submetidos por entidade executora',
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
                dataSubmissao: z.coerce.date().nullable(),
                codPropriedade: z.number().nullable(),
                caminhoArquivo: z.string().nullable(),
                CodMicroBacia: z.number(),
                entidadeexecutora: z
                  .object({
                    codEntExec: z.number(),
                    nome: z.string(),
                  })
                  .nullable(),
                entidade_gerenciadora: z
                  .object({
                    codEntGer: z.number(),
                    nome: z.string(),
                  })
                  .nullable(),
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
          const projetos = await listarProjetosSubmetidosPorEntExec()
          const formattedProjetos = projetos.map(proj => ({
            codProjeto: proj.codProjeto,
            titulo: proj.titulo ?? '',
            objetivo: proj.objetivo ?? '',
            acoes: proj.acoes ?? '',
            cronograma: proj.cronograma ?? '',
            orcamento: proj.orcamento ?? 0,
            dataSubmissao: proj.dataSubmissao ?? null,
            codPropriedade: proj.codPropriedade ?? null,
            caminhoArquivo: proj.caminhoArquivo ?? null,
            CodMicroBacia: proj.CodMicroBacia ?? 0,
            entidadeexecutora: proj.entidadeexecutora
              ? {
                  codEntExec: proj.entidadeexecutora.codEntExec,
                  nome: proj.entidadeexecutora.nome,
                }
              : null,
            entidade_gerenciadora: proj.entidade_gerenciadora
              ? {
                  codEntGer: proj.entidade_gerenciadora.codEntGer,
                  nome: proj.entidade_gerenciadora.nome,
                }
              : null,
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

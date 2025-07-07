import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { listarProjetosSubmetidosPorEntExec } from '../../../functions/entidade-executora/projeto/listar-projetos-submetidos-por-ent-exec'
import { Perfil, verificarPermissao } from '../../../middlewares/auth'

export const listarProjetosAprovadosRoute: FastifyPluginAsyncZod =
  async app => {
    app.get(
      '/api/projetos/aprovados',
      {
        preHandler: verificarPermissao(Perfil.ENTIDADE_EXECUTORA),
        schema: {
          summary: 'Listar projetos aprovados por entidade executora',
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
                avaliacao: z.object({
                  bc_aprovado: z.boolean().nullable(),
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
        const { codUsuario } = request.user as { codUsuario: number }
        if (!codUsuario) {
          return reply.status(401).send({ error: 'Usuário não autenticado' })
        }

        try {
          const projetos = await listarProjetosSubmetidosPorEntExec({
            codUsuario,
          })
          const formattedProjetos = projetos.map(proj => ({
            codProjeto: proj.codProjeto,
            titulo: proj.titulo ?? '',
            objetivo: proj.objetivo ?? '',
            acoes: proj.acoes ?? '',
            cronograma: proj.cronograma ?? '',
            orcamento: proj.orcamento ?? 0,
            dataSubmissao: proj.dataSubmissao ?? null,
            codPropriedade: proj.codPropriedade ?? null,
            CodMicroBacia: proj.CodMicroBacia ?? 0,
            CodEntExec: proj.CodEntExec ?? 0,
            tipo_projeto: {
              codTipoProjeto: proj.tipo_projeto?.codTipoProjeto ?? 0,
              nome: proj.tipo_projeto?.nome ?? '',
              descricao: proj.tipo_projeto?.descricao ?? '',
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
            avaliacao: {
              bc_aprovado: proj.avaliacao?.bc_aprovado ?? null,
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

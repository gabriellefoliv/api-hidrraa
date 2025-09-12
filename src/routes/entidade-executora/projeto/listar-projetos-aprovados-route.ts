import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { listarProjetosAprovados } from '../../../functions/entidade-executora/projeto/listar-projetos-aprovados'
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
                      codMarcoRecomendado: z.number(),
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
        const { codUsuario } = request.user as { codUsuario: number }
        if (!codUsuario) {
          return reply.status(401).send({ error: 'Usuário não autenticado' })
        }

        try {
          const projetos = await listarProjetosAprovados()

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
              execucao_marcos:
                proj.tipo_projeto?.marco_recomendado?.flatMap(marco =>
                  marco.execucao_marco
                    .filter(execucao => execucao.codProjeto === proj.codProjeto)
                    .map(m => ({
                      codMarcoRecomendado: marco.codMarcoRecomendado,
                      descricao: m.descricao ?? '',
                      valorEstimado: m.valorEstimado ?? 0,
                      dataConclusaoPrevista:
                        m.dataConclusaoPrevista ?? new Date(0),
                    }))
                ) ?? [],
            },
            microbacia: {
              codMicroBacia: proj.microbacia?.CodMicroBacia ?? 0,
              nome: proj.microbacia?.Nome ?? '',
            },
          }))

          return reply.status(200).send(formattedProjetos)
          // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        } catch (error: any) {
          return reply
            .status(404)
            .send({ error: error.message || 'Erro ao buscar projetos.' })
        }
      }
    )
  }

import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { listarProjetosSalvosPorEntExec } from '../../../functions/entidade-executora/projeto/listar-projetos-salvos-por-ent-exec'
import { Perfil, verificarPermissao } from '../../../middlewares/auth'

export const listarProjetosSalvosPorEntExecRoute: FastifyPluginAsyncZod =
  async app => {
    app.get(
      '/api/projetos/salvos',
      {
        preHandler: verificarPermissao(Perfil.ENTIDADE_EXECUTORA),
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
          const projetos = await listarProjetosSalvosPorEntExec({ codUsuario })
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

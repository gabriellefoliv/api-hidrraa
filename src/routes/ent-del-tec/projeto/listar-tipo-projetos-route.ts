import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { listarTiposProjeto } from '../../../functions/ent-del-tec/projeto/listar-tipos-projeto'
import { Perfil, verificarPermissao } from '../../../middlewares/auth'

export const listarTiposProjetoRoute: FastifyPluginAsyncZod = async app => {
  app.get(
    '/api/tipos-projeto',
    {
      preHandler: verificarPermissao(Perfil.ENT_DEL_TEC),
      schema: {
        summary: 'Listar tipos de projeto',
        tags: ['Projeto'],
        response: {
          200: z.array(
            z.object({
              id: z.number(),
              nome: z.string(),
              descricao: z.string(),
              marcosRecomendados: z.array(
                z.object({
                  codMarcoRecomendado: z.number(),
                  descricao: z.string(),
                  evidenciasDemandadas: z.array(
                    z.object({
                      codEvidenciaDemandada: z.number(),
                      descricao: z.string(),
                      tipoArquivo: z.string(),
                    })
                  ),
                })
              ),
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
        const tp = await listarTiposProjeto()

        if (!tp) {
          return reply.status(404).send({ error: 'Modelo não encontrado.' })
        }

        const formattedTp = tp.map(tipoProjeto => ({
          id: tipoProjeto.codTipoProjeto,
          nome: tipoProjeto.nome,
          descricao: tipoProjeto.descricao,
          marcosRecomendados: tipoProjeto.marco_recomendado.map(marco => ({
            codMarcoRecomendado: marco.codMarcoRecomendado,
            descricao: marco.descricao,
            evidenciasDemandadas: marco.evidencia_demandada.map(evidencia => ({
              codEvidenciaDemandada: evidencia.codEvidenciaDemandada,
              descricao: evidencia.descricao,
              tipoArquivo: evidencia.tipoArquivo,
            })),
          })),
        }))

        return reply.status(200).send(formattedTp)
      } catch (error) {
        if (error instanceof Error) {
          return reply.status(500).send({ error: error.message })
        }
        return reply.status(500).send({ error: 'Erro do servidor.' })
      }
    }
  )
}

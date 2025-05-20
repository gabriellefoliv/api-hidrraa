import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { listarDetalhesModelo } from '../../../functions/entidade-executora/projeto/listar-detalhes-modelo'
import { Perfil, verificarPermissao } from '../../../middlewares/auth'

export const listarDetalhesModeloRoute: FastifyPluginAsyncZod = async app => {
  app.get(
    '/api/tipos-projeto/:codTipoProjeto',
    {
      preHandler: verificarPermissao(Perfil.ENTIDADE_EXECUTORA),
      schema: {
        summary: 'Listar detalhes de um tipo de projeto',
        tags: ['Tipos de Projeto'],
        params: z.object({
          codTipoProjeto: z.number(),
        }),
        response: {
          200: z.object({
            codTipoProjeto: z.number(),
            nome: z.string(),
            descricao: z.string(),
            marcosRecomendados: z.array(
              z.object({
                codMarcoRecomendado: z.number(),
                descricao: z.string(),
                valorEstimado: z.number(),
                evidenciasDemandadas: z.array(
                  z.object({
                    codEvidenciaDemandada: z.number(),
                    descricao: z.string(),
                    tipoArquivo: z.string(),
                  })
                ),
              })
            ),
          }),
          404: z.object({
            error: z.string(),
          }),
          500: z.object({
            error: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      try {
        const { codTipoProjeto } = request.params
        const modelo = await listarDetalhesModelo({ codTipoProjeto })

        if (!modelo) {
          return reply.status(404).send({ error: 'Modelo não encontrado.' })
        }

        const formattedModelo = {
          codTipoProjeto: modelo.codTipoProjeto,
          nome: modelo.nome,
          descricao: modelo.descricao,
          marcosRecomendados: modelo.marco_recomendado.map(marco => ({
            codMarcoRecomendado: marco.codMarcoRecomendado,
            descricao: marco.descricao,
            valorEstimado: marco.valorEstimado,
            evidenciasDemandadas: marco.evidencia_demandada.map(evidencia => ({
              codEvidenciaDemandada: evidencia.codEvidenciaDemandada,
              descricao: evidencia.descricao,
              tipoArquivo: evidencia.tipoArquivo,
            })),
          })),
        }

        return reply.status(200).send(formattedModelo)
      } catch (error) {
        return reply.status(500).send({ error: 'Erro do servidor.' })
      }
    }
  )
}

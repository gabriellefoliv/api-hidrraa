import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { listarEvidenciasPorMarco } from '../../../functions/entidade-executora/execucao-marco/listar-evidencias-por-marco'
import { Perfil, verificarPermissao } from '../../../middlewares/auth'

export const listarEvidenciasRoute: FastifyPluginAsyncZod = async app => {
  app.get(
    '/api/evidencias/:codProjeto/:codExecucaoMarco',
    {
      preHandler: verificarPermissao([
        Perfil.ENTIDADE_EXECUTORA,
        Perfil.ENT_GER,
      ]),
      schema: {
        summary:
          'Listar evidências + relatório por projeto e execução de marco',
        tags: ['Evidência'],
        params: z.object({
          codProjeto: z.coerce.number(),
          codExecucaoMarco: z.coerce.number(),
        }),
        response: {
          200: z.object({
            codExecucaoMarco: z.number(),
            descricao: z.string().nullable(),
            dataConclusaoEfetiva: z.coerce.date().nullable(),
            bc_statusValidacaoCBH: z.string().nullable(),
            evidencia_apresentada: z.array(
              z.object({
                codEvidenciaApresentada: z.number(),
                caminhoArquivo: z.string(),
                dataUpload: z.coerce.date(),
                codEvidenciaDemandada: z.number(),
              })
            ),
            relatorio_gerenciadora: z.array(
              z.object({
                codRelGer: z.number(),
                caminhoArquivo: z.string(),
                dataUpload: z.coerce.date(),
              })
            ),
          }),
          404: z.object({
            error: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { codProjeto, codExecucaoMarco } = request.params

      const dados = await listarEvidenciasPorMarco({
        codProjeto,
        codExecucaoMarco,
      })

      if (!dados) {
        return reply.status(404).send({ error: 'Evidências não encontradas.' })
      }

      // Format the response to ensure all fields match the schema
      const formattedDados = {
        codExecucaoMarco: dados.codExecucaoMarco ?? 0,
        descricao: dados.descricao ?? null,
        dataConclusaoEfetiva: dados.dataConclusaoEfetiva ?? null,
        bc_statusValidacaoCBH: dados.bc_statusValidacaoCBH ?? null,
        evidencia_apresentada: Array.isArray(dados.evidencia_apresentada)
          ? dados.evidencia_apresentada.map(e => ({
              codEvidenciaApresentada: e.codEvidenciaApresentada ?? 0,
              caminhoArquivo: e.caminhoArquivo ?? '',
              dataUpload: e.dataUpload ?? new Date(0),
              codEvidenciaDemandada: e.codEvidenciaDemandada ?? 0,
            }))
          : [],
        relatorio_gerenciadora: Array.isArray(dados.relatorio_gerenciadora)
          ? dados.relatorio_gerenciadora.map(r => ({
              codRelGer: r.codRelGer ?? 0,
              caminhoArquivo: r.caminhoArquivo ?? '',
              dataUpload: r.dataUpload ?? new Date(0),
            }))
          : [],
      }

      return reply.send(formattedDados)
    }
  )
}

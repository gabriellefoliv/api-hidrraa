import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { atualizarProjeto } from '../../../functions/entidade-executora/projeto/atualizar-projeto'
import { Perfil, verificarPermissao } from '../../../middlewares/auth'

const marcoSchema = z.object({
  codExecucaoMarco: z.number().optional(),
  codMarcoRecomendado: z.number(),
  descricao: z.string().optional(),
  descrDetAjustes: z.string().optional(),
  valorEstimado: z.number().optional(),
  dataConclusaoPrevista: z.string().datetime().optional(),
})

export const atualizarProjetoRoute: FastifyPluginAsyncZod = async app => {
  app.put(
    '/api/projetos/:codProjeto',
    {
      preHandler: verificarPermissao(Perfil.ENTIDADE_EXECUTORA),
      schema: {
        summary: 'Atualizar projeto parcialmente',
        tags: ['Projeto'],
        params: z.object({
          codProjeto: z.coerce.number(),
        }),
        body: z.object({
          titulo: z.string().optional(),
          objetivo: z.string().optional(),
          acoes: z.string().optional(),
          cronograma: z.string().optional(),
          orcamento: z.number().optional(),
          codPropriedade: z.number().optional(),
          codTipoProjeto: z.number().optional(),
          CodMicroBacia: z.number().optional(),
          marcos: z.array(marcoSchema).optional(),
        }),
        response: {
          200: z.object({
            mensagem: z.string(),
          }),
          401: z.object({
            error: z.string(),
          }),
          404: z.object({
            error: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { codProjeto } = request.params
      const { codUsuario } = (request.user as { codUsuario?: number }) || {}

      if (!codUsuario) {
        return reply.status(401).send({ error: 'Usuário não autenticado' })
      }

      try {
        const resultado = await atualizarProjeto({
          codProjeto,
          ...request.body,
          marcos: request.body.marcos?.map(marco => ({
            ...marco,
            dataConclusaoPrevista: marco.dataConclusaoPrevista
              ? new Date(marco.dataConclusaoPrevista)
              : undefined,
          })),
        })

        return reply.status(200).send(resultado)
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      } catch (error: any) {
        return reply
          .status(404)
          .send({ error: error.message || 'Erro ao atualizar projeto' })
      }
    }
  )
}

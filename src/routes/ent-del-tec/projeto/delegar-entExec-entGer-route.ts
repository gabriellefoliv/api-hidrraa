import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { DelegarEntExecEntGer } from '../../../functions/ent-del-tec/projeto/delegar-entExec-entGer'
import { Perfil, verificarPermissao } from '../../../middlewares/auth'

export const delegarEntExecEntGerRoute: FastifyPluginAsyncZod = async app => {
  app.put(
    '/api/projetos/submetidos/:codProjeto',
    {
      preHandler: verificarPermissao(Perfil.ENT_DEL_TEC),
      schema: {
        summary:
          'Delegar uma entidade executora e uma entidade gerenciadora a um projeto',
        tags: ['Projeto'],
        params: z.object({
          codProjeto: z.coerce.number(),
        }),
        body: z.object({
          CodEntExec: z.number(),
          codEntGer: z.number(),
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
      const { CodEntExec, codEntGer } = request.body

      try {
        await DelegarEntExecEntGer({
          codProjeto,
          CodEntExec,
          codEntGer,
        })

        return reply.status(200).send({
          mensagem:
            'Projeto salvo com entidade executora e/ou entidade gerenciadora',
        })
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      } catch (error: any) {
        return reply
          .status(404)
          .send({ error: error.message || 'Erro ao atualizar projeto' })
      }
    }
  )
}

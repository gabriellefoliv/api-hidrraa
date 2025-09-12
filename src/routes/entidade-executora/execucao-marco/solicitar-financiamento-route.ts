import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { solicitarFinanciamento } from '../../../functions/entidade-executora/execucao-marco/solicitar-financiamento'
import { Perfil, verificarPermissao } from '../../../middlewares/auth'

export const solicitarFinanciamentoRoute: FastifyPluginAsyncZod = async app => {
  app.post(
    '/api/financiamento/solicitar',
    {
      preHandler: verificarPermissao(Perfil.ENTIDADE_EXECUTORA),
      schema: {
        summary: 'Solicita um pagamento para um marco',
        tags: ['Financiamento'],
        body: z.object({
          codExecucaoMarco: z.number(),
          valorSolicitado: z.number().positive('O valor deve ser positivo.'),
        }),
        response: {
          201: z.object({
            pagamentoId: z.number(),
            message: z.string(),
          }),
          400: z.object({ error: z.string() }),
          403: z.object({ error: z.string() }),
          404: z.object({ error: z.string() }),
        },
      },
    },
    async (request, reply) => {
      const { codUsuario } = request.user as { codUsuario: number }
      const { codExecucaoMarco, valorSolicitado } = request.body

      try {
        const novaSolicitacao = await solicitarFinanciamento({
          codExecucaoMarco,
          valorSolicitado,
          codUsuario,
        })

        return reply.status(201).send({
          pagamentoId: novaSolicitacao.codPagtoMarco,
          message: 'Solicitação de financiamento enviada com sucesso.',
        })
      } catch (error) {
        const errorMessage = (error as Error).message

        if (errorMessage.includes('não encontrada')) {
          return reply.status(404).send({ error: errorMessage })
        }
        if (errorMessage.includes('não tem permissão')) {
          return reply.status(403).send({ error: errorMessage })
        }
        return reply.status(400).send({ error: errorMessage })
      }
    }
  )
}

import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { ValidarEvidencias } from '../../../functions/ent-del-tec/analise-evidencia/validar-evidencias'
import { Perfil, verificarPermissao } from '../../../middlewares/auth'

export const validarEvidenciasRoute: FastifyPluginAsyncZod = async app => {
  app.patch(
    '/api/marco/:codExecucaoMarco/validar',
    {
      preHandler: verificarPermissao([Perfil.ENT_DEL_TEC]),
      schema: {
        summary: 'Validar evidências de um marco',
        tags: ['Evidência'],
        body: z.object({
          status: z.enum(['APROVADO', 'REPROVADO', 'PENDENTE']),
          comentario: z.string().optional(),
        }),
        params: z.object({
          codExecucaoMarco: z.coerce.number(),
        }),
        response: {
          200: z.object({
            message: z.string(),
          }),
          404: z.object({
            error: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { codExecucaoMarco } = request.params
      const { status, comentario } = request.body

      try {
        await ValidarEvidencias({ codExecucaoMarco, status, comentario })
        return reply.send({ message: 'Validação atualizada com sucesso.' })
      } catch (err) {
        const errorMessage =
          typeof err === 'object' && err !== null && 'message' in err
            ? String((err as { message: unknown }).message)
            : 'Erro desconhecido'
        return reply.status(404).send({ error: errorMessage })
      }
    }
  )
}

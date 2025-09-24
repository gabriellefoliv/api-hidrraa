import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { loginUsuario } from '../../functions/auth/login'

export const loginRoute: FastifyPluginAsyncZod = async app => {
  app.post(
    '/api/login',
    {
      schema: {
        summary: 'Login de usuário',
        tags: ['Autenticação'],
        body: z.object({
          email: z.string().email(),
          senha: z.string(),
        }),
        response: {
          200: z.object({
            token: z.string(),
            usuario: z.object({
              codUsuario: z.number(),
              nome: z.string(),
              email: z.string().email(),
              perfil: z.string(),
              codCBH: z.number(),
            }),
          }),
          401: z.object({
            error: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      try {
        const { email, senha } = request.body
        const { codUsuario, nome, perfil, codCBH } = await loginUsuario({
          email,
          senha,
        })

        const token = app.jwt.sign({ codUsuario, perfil })

        return reply.status(200).send({
          token,
          usuario: { codUsuario, nome, email, perfil, codCBH },
        })
      } catch (error) {
        return reply.status(401).send({
          error:
            error instanceof Error ? error.message : 'Erro durante o login.',
        })
      }
    }
  )
}

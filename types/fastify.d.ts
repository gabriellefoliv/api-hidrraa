import type { FastifyReply, FastifyRequest } from 'fastify'
import type { Perfil } from '../plugins/auth'

declare module 'fastify' {
  interface FastifyInstance {
    // Middleware de autenticação básico
    authenticate: (
      request: FastifyRequest,
      reply: FastifyReply
    ) => Promise<void>

    // Middleware de autorização baseado em perfis
    authorize: (
      perfisPermitidos: Perfil | Perfil[]
    ) => (request: FastifyRequest, reply: FastifyReply) => Promise<void>
  }
}

import type { FastifyReply, FastifyRequest } from 'fastify'

// Tipos de perfis de usuário
export enum Perfil {
  ENTIDADE_EXECUTORA = 'entidade_executora',
  MEMBRO_COMITE = 'membro_comite',
  INVESTIDOR = 'investidor',
}

// Middleware simples de verificação de autenticação
export async function verificarAutenticacao(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    await request.jwtVerify()
  } catch (err) {
    return reply.status(401).send({ error: 'Não autenticado' })
  }
}

// Middleware de verificação de permissão por perfil
export function verificarPermissao(perfisPermitidos: Perfil | Perfil[]) {
  const perfis = Array.isArray(perfisPermitidos)
    ? perfisPermitidos
    : [perfisPermitidos]

  return async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      // Verifica se o token é válido
      await request.jwtVerify()

      // Verifica se o perfil do usuário está entre os permitidos
      const perfilUsuario = request.user.perfil

      if (!perfis.includes(perfilUsuario)) {
        return reply.status(403).send({
          error: 'Acesso negado',
          message: 'Seu perfil não tem permissão para acessar este recurso',
        })
      }
    } catch (err) {
      return reply.status(401).send({ error: 'Não autenticado' })
    }
  }
}

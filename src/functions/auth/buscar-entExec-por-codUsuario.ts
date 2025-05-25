import prisma from '../../lib/prisma'

export async function buscarEntExecPorCodUsuario(codUsuario: number) {
  const ent = await prisma.entidadeexecutora.findFirst({
    where: {
      codUsuario,
    },
  })

  if (!ent) {
    throw new Error('Entidade executora não encontrada para este usuário.')
  }

  return ent
}

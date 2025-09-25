import prisma from '../../lib/prisma'

export async function ListarEntExecs() {
  const ents = await prisma.entidadeexecutora.findMany({
    select: {
      codEntExec: true,
      nome: true,
    },
  })

  if (!ents) {
    throw new Error('Entidade executora não encontrada para este usuário.')
  }

  return ents
}

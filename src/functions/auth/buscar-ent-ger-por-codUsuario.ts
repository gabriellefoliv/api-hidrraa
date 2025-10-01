import prisma from '../../lib/prisma'

export async function buscarEntidadeGerenciadoraPorCodUsuario(
  codUsuario: number
) {
  const ger = await prisma.entidade_gerenciadora.findFirst({
    where: {
      codUsuario,
    },
  })

  if (!ger) {
    throw new Error('Entidade gerenciadora não encontrada para este usuário.')
  }

  return ger
}

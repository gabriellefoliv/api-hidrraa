import prisma from '../../lib/prisma'

export async function buscarInvestidorPorCodUsuario(codUsuario: number) {
  const inv = await prisma.investidor_esg.findFirst({
    where: {
      codUsuario,
    },
  })

  if (!inv) {
    throw new Error('Entidade executora não encontrada para este usuário.')
  }

  return inv
}

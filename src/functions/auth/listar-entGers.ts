import prisma from '../../lib/prisma'

export async function ListarEntGers() {
  const gers = await prisma.entidade_gerenciadora.findMany({
    select: {
      codEntGer: true,
      nome: true,
    },
  })

  if (!gers) {
    throw new Error('Nenhuma entidade gerenciadora encontrada.')
  }

  return gers
}

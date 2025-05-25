import prisma from '../../../lib/prisma'

export async function listarCriterios() {
  const criterios = await prisma.criterio_aval.findMany({
    select: {
      codCriterioAval: true,
      descricao: true,
      peso: true,
    },
    orderBy: {
      codCriterioAval: 'asc',
    },
  })

  return criterios
}

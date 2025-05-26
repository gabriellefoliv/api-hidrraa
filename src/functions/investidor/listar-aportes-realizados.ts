import prisma from '../../lib/prisma'

interface ListarAportesRealizadosParams {
  codInvestidor: number
}

export async function listarAportesRealizados({
  codInvestidor,
}: ListarAportesRealizadosParams) {
  return await prisma.aporte.findMany({
    where: {
      codInvestidor,
    },
    orderBy: {
      dataInvestimento: 'desc',
    },
  })
}

import prisma from '../../lib/prisma'

interface ListarAportesProps {
  codInvestidor: number
}

export async function listarAportesRealizados({
  codInvestidor,
}: ListarAportesProps) {
  const aportes = await prisma.aporte.findMany({
    where: {
      codInvestidor,
    },
    include: {
      transacoes: true,
    },
    orderBy: {
      dataInvestimento: 'desc',
    },
  })

  return aportes
}

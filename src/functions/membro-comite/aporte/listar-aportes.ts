import prisma from '../../../lib/prisma'

export async function listarAportes() {
  return await prisma.aporte.findMany({
    include: {
      investidor_esg: {
        select: {
          razaoSocial: true,
        },
      },
    },
    orderBy: {
      dataInvestimento: 'desc',
    },
  })
}

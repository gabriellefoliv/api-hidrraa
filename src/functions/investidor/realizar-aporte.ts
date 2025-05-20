import prisma from '../../lib/prisma'

interface RealizarAporteParams {
  codInvestidor: number
  codCBH: number
  bc_valor: number
}

export async function realizarAporte({
  codInvestidor,
  codCBH,
  bc_valor,
}: RealizarAporteParams) {
  const novoAporte = await prisma.aporte.create({
    data: {
      codInvestidor,
      codCBH,
      bc_valor,
      dataInvestimento: new Date(),
      validadoAGEVAP: false,
    },
  })

  return {
    aporteId: novoAporte.codAporte,
  }
}

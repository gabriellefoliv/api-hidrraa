import prisma from '../../lib/prisma'

interface RealizarAporteParams {
  codUsuario: number
  bc_valor: number
}

export async function realizarAporte({
  codUsuario,
  bc_valor,
}: RealizarAporteParams) {
  const investidor = await prisma.investidor_esg.findFirst({
    where: {
      codUsuario,
    },
  })

  if (!investidor) {
    throw new Error('Investidor não encontrado.')
  }
  const usuario = await prisma.usuario.findUnique({
    where: {
      codUsuario,
    },
  })

  if (!usuario) {
    throw new Error('Usuário não encontrado.')
  }

  const novoAporte = await prisma.aporte.create({
    data: {
      codInvestidor: investidor.codInvestidor,
      codCBH: usuario.codCBH,
      bc_valor,
      dataInvestimento: new Date(),
      validadoAGEVAP: false,
    },
  })

  return {
    aporteId: novoAporte.codAporte,
  }
}

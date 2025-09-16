import prisma from '../../../lib/prisma'

interface ValidarAporteParams {
  codAporte: number
}

export async function validarAporte({ codAporte }: ValidarAporteParams) {
  const aporte = await prisma.aporte.update({
    where: { codAporte },
    data: {
      validadoAGEVAP: true,
    },
  })

  return {
    codAporte: aporte.codAporte,
    validadoAGEVAP: aporte.validadoAGEVAP,
  }
}

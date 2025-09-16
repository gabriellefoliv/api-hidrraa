import prisma from '../../../lib/prisma'

interface AtualizarMicrobaciaParams {
  CodMicroBacia: number
  Nome: string
  CodCBH: number
}

export async function atualizarMicrobacia({
  CodMicroBacia,
  Nome,
  CodCBH,
}: AtualizarMicrobaciaParams) {
  const novaMicrobacia = await prisma.microbacia.update({
    where: {
      CodMicroBacia,
    },
    data: {
      Nome,
      CodCBH,
    },
  })

  return {
    novaMicrobacia,
  }
}

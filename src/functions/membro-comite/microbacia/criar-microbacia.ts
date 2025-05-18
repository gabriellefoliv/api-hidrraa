import prisma from '../../../lib/prisma'

interface CriarMicrobaciaParams {
  Nome: string
  CodCBH: number
}

export async function criarMicrobacia({ Nome, CodCBH }: CriarMicrobaciaParams) {
  const microbacia = await prisma.microbacia.create({
    data: {
      Nome,
      CodCBH,
    },
  })

  return {
    microbaciaId: microbacia.CodMicroBacia,
  }
}

import prisma from '../../../lib/prisma'

interface DeletarMicrobaciaParams {
  CodMicroBacia: number
}

export async function deletarMicrobacia({
  CodMicroBacia,
}: DeletarMicrobaciaParams) {
  await prisma.microbacia.delete({
    where: {
      CodMicroBacia,
    },
  })
}

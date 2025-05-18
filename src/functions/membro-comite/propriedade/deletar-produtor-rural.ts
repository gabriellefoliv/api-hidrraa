import prisma from '../../../lib/prisma'

interface DeletarPropriedadeParams {
  codPropriedade: number
}

export async function deletarPropriedade({
  codPropriedade,
}: DeletarPropriedadeParams) {
  await prisma.propriedade.delete({
    where: {
      codPropriedade,
    },
  })
}

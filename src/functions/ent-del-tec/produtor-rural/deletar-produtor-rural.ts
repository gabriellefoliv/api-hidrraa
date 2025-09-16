import prisma from '../../../lib/prisma'

interface DeletarProdutorRuralParams {
  codProdutor: number
}

export async function deletarProdutorRural({
  codProdutor,
}: DeletarProdutorRuralParams) {
  await prisma.produtor_rural.delete({
    where: {
      codProdutor,
    },
  })
}

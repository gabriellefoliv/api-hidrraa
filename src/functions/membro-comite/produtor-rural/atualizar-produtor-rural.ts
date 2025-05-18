import prisma from '../../../lib/prisma'

interface AtualizarProdutorRuralParams {
  codProdutor: number
  nome: string
  cpf: number
  contato: number
  codCBH: number
}

export async function atualizarProdutorRural({
  codProdutor,
  nome,
  cpf,
  contato,
  codCBH,
}: AtualizarProdutorRuralParams) {
  const novoProdutor = await prisma.produtor_rural.update({
    where: {
      codProdutor,
    },
    data: {
      nome,
      cpf,
      contato,
      codCBH,
    },
  })

  return {
    novoProdutor,
  }
}

import prisma from '../../../lib/prisma'

interface CriarProdutorRuralParams {
  nome: string
  cpf: number
  contato: number
  codCBH: number
}

export async function criarProdutorRural({
  nome,
  cpf,
  contato,
  codCBH,
}: CriarProdutorRuralParams) {
  const produtorRural = await prisma.produtor_rural.create({
    data: {
      nome,
      cpf,
      contato,
      codCBH,
    },
  })

  return {
    produtorRuralId: produtorRural.codProdutor,
  }
}

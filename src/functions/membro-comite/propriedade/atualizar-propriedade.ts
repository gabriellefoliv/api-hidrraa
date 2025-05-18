import prisma from '../../../lib/prisma'

interface AtualizarPropriedadeParams {
  codPropriedade: number
  logradouro: string
  numero: number
  complemento: string
  cep: number
  bairro: string
  cidade: string
  uf: string
  codProdutor: number
  CodMicroBacia: number
}

export async function atualizarPropriedade({
  codPropriedade,
  logradouro,
  complemento,
  cep,
  bairro,
  cidade,
  uf,
  codProdutor,
  CodMicroBacia,
}: AtualizarPropriedadeParams) {
  const novaPropriedade = await prisma.propriedade.update({
    where: {
      codPropriedade,
    },
    data: {
      logradouro,
      complemento,
      cep,
      bairro,
      cidade,
      uf,
      codProdutor,
      CodMicroBacia,
    },
  })

  return {
    novaPropriedade,
  }
}

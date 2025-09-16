// propriedade(codPropriedade, logradouro, numero, complemento, cep, bairro, cidade, uf, codProdutor, codMicrobacia)
import prisma from '../../../lib/prisma'

interface CriarPropriedadeParams {
  logradouro: string
  numero: number
  complemento: string
  cep: string
  bairro: string
  cidade: string
  uf: string
  codProdutor: number
  CodMicroBacia: number
}

export async function criarPropriedade({
  logradouro,
  numero,
  complemento,
  cep,
  bairro,
  cidade,
  uf,
  CodMicroBacia,
  codProdutor,
}: CriarPropriedadeParams) {
  const propriedade = await prisma.propriedade.create({
    data: {
      logradouro,
      numero,
      complemento,
      cep,
      bairro,
      cidade,
      uf,
      CodMicroBacia,
      codProdutor,
    },
  })

  return {
    propriedadeId: propriedade.codPropriedade,
  }
}

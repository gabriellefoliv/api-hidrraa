import prisma from '../../../lib/prisma'

interface CriarCriterioParams {
  descricao: string
  peso: number
}

export async function criarCriterio({ descricao, peso }: CriarCriterioParams) {
  const criterioExistente = await prisma.criterio_aval.findFirst({
    where: {
      descricao: {
        equals: descricao,
      },
    },
  })

  if (criterioExistente) {
    throw new Error('Já existe um critério com esta descrição.')
  }

  const novoCriterio = await prisma.criterio_aval.create({
    data: {
      descricao,
      peso,
    },
  })

  return {
    codCriterioAval: novoCriterio.codCriterioAval,
    descricao: novoCriterio.descricao,
    peso: novoCriterio.peso,
  }
}

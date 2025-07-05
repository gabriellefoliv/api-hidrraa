import prisma from '../../../lib/prisma'

interface AvaliacaoItemInput {
  codCriterioAval: number
  nota: number
  parecer: string
}

interface AvaliacaoInput {
  codProjeto: number
  codAvaliador: number
  dataIni: Date
  dataFim: Date
  bc_valorPagto: number
  itens: AvaliacaoItemInput[]
}

export async function avaliarProjeto({
  codProjeto,
  codAvaliador,
  dataIni,
  dataFim,
  bc_valorPagto,
  itens,
}: AvaliacaoInput) {
  // Calcular média ponderada antes de salvar
  const avalItens = await Promise.all(
    itens.map(async item => {
      const criterio = await prisma.criterio_aval.findUnique({
        where: { codCriterioAval: item.codCriterioAval },
      })

      if (!criterio)
        throw new Error(`Critério ${item.codCriterioAval} não encontrado.`)

      return {
        codCriterioAval: item.codCriterioAval,
        nota: item.nota,
        parecer: item.parecer,
        peso: criterio.peso,
        notaPonderada: item.nota * criterio.peso,
      }
    })
  )

  const totalPeso = avalItens.reduce((acc, item) => acc + item.peso, 0)
  const somaNotasPonderadas = avalItens.reduce(
    (acc, item) => acc + item.notaPonderada,
    0
  )
  const mediaPonderada = totalPeso > 0 ? somaNotasPonderadas / totalPeso : 0

  const aprovado = mediaPonderada >= 7

  const avaliacao = await prisma.avaliacao.create({
    data: {
      codProjeto,
      codAvaliador,
      dataIni,
      dataFim,
      bc_valorPagto,
      bc_aprovado: aprovado,
    },
  })

  await prisma.avaliacao_item.createMany({
    data: avalItens.map(item => ({
      codAvaliacao: avaliacao.codAvaliacao,
      codCriterioAval: item.codCriterioAval,
      nota: item.nota,
      parecer: item.parecer,
    })),
  })

  return {
    codAvaliacao: avaliacao.codAvaliacao,
    mediaPonderada: Number(mediaPonderada.toFixed(2)),
    aprovado,
  }
}

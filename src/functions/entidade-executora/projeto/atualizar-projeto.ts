import prisma from '../../../lib/prisma'

interface MarcoUpdate {
  codExecucaoMarco: number
  descricao?: string
  descrDetAjustes?: string
  valorEstimado?: number
}

interface AtualizarProjetoParams {
  codProjeto: number
  titulo?: string
  objetivo?: string
  acoes?: string
  cronograma?: string
  orcamento?: number
  codPropriedade?: number
  codTipoProjeto?: number
  CodMicroBacia?: number
  marcos?: MarcoUpdate[]
}

export async function atualizarProjeto({
  codProjeto,
  titulo,
  objetivo,
  acoes,
  cronograma,
  orcamento,
  codPropriedade,
  codTipoProjeto,
  CodMicroBacia,
  marcos,
}: AtualizarProjetoParams) {
  const projeto = await prisma.projeto.findUnique({
    where: { codProjeto },
  })

  if (!projeto || projeto.dataSubmissao) {
    throw new Error('Projeto não encontrado ou já submetido.')
  }

  // Monta um objeto só com os campos que vieram para atualizar
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const dadosAtualizacao: any = {}
  if (titulo !== undefined) dadosAtualizacao.titulo = titulo
  if (objetivo !== undefined) dadosAtualizacao.objetivo = objetivo
  if (acoes !== undefined) dadosAtualizacao.acoes = acoes
  if (cronograma !== undefined) dadosAtualizacao.cronograma = cronograma
  if (orcamento !== undefined) dadosAtualizacao.orcamento = orcamento
  if (codPropriedade !== undefined)
    dadosAtualizacao.codPropriedade = codPropriedade
  if (codTipoProjeto !== undefined)
    dadosAtualizacao.codTipoProjeto = codTipoProjeto
  if (CodMicroBacia !== undefined)
    dadosAtualizacao.CodMicroBacia = CodMicroBacia

  if (Object.keys(dadosAtualizacao).length > 0) {
    await prisma.projeto.update({
      where: { codProjeto },
      data: dadosAtualizacao,
    })
  }

  if (marcos && marcos.length > 0) {
    const atualizacoes = marcos.map(marco =>
      prisma.execucao_marco.update({
        where: { codExecucaoMarco: marco.codExecucaoMarco },
        data: {
          ...(marco.descricao !== undefined && { descricao: marco.descricao }),
          ...(marco.descrDetAjustes !== undefined && {
            descrDetAjustes: marco.descrDetAjustes,
          }),
          ...(marco.valorEstimado !== undefined && {
            valorEstimado: marco.valorEstimado,
          }),
        },
      })
    )
    await Promise.all(atualizacoes)
  }

  return { mensagem: 'Projeto e marcos atualizados com sucesso.' }
}

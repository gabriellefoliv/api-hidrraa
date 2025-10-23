import prisma from '../../../lib/prisma'

interface CriarProjetoParams {
  titulo: string
  objetivo: string
  acoes: string
  cronograma: string
  orcamento: number
  codPropriedade: number
  codTipoProjeto: number
  CodMicroBacia: number
  caminhoArquivo: string
  marcos: {
    codMarcoRecomendado: number
    descricao: string
    descrDetAjustes?: string
    valorEstimado: number
    dataConclusaoPrevista: Date
  }[]
}

export async function criarProjeto(params: CriarProjetoParams) {
  const {
    titulo,
    objetivo,
    acoes,
    cronograma,
    orcamento,
    codPropriedade,
    codTipoProjeto,
    CodMicroBacia,
    caminhoArquivo,
    marcos,
  } = params

  const projeto = await prisma.projeto.create({
    data: {
      titulo: titulo ?? '',
      objetivo: objetivo ?? '',
      acoes: acoes ?? '',
      cronograma: cronograma ?? '',
      orcamento: orcamento ?? 0,
      caminhoArquivo: caminhoArquivo ?? '',
      codPropriedade,
      codTipoProjeto,
      CodMicroBacia,
    },
  })

  await prisma.execucao_marco.createMany({
    data: marcos.map(m => ({
      codProjeto: projeto.codProjeto,
      codMarcoRecomendado: m.codMarcoRecomendado,
      descricao: m.descricao ?? '',
      descrDetAjustes: m.descrDetAjustes ?? '',
      valorEstimado: m.valorEstimado ?? 0,
      dataConclusaoPrevista: m.dataConclusaoPrevista ?? null,
    })),
  })

  return {
    mensagem: 'Projeto criado com sucesso!',
    projetoId: projeto.codProjeto,
  }
}

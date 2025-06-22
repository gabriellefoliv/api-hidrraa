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
  CodEntExec: number
  marcos: {
    codMarcoRecomendado: number
    descricao: string
    descrDetAjustes?: string
    valorEstimado: number
    dataConclusao: Date
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
    CodEntExec,
    marcos,
  } = params

  const projeto = await prisma.projeto.create({
    data: {
      titulo,
      objetivo,
      acoes,
      cronograma,
      orcamento,
      codPropriedade,
      codTipoProjeto,
      CodMicroBacia,
      CodEntExec,
    },
  })

  await prisma.execucao_marco.createMany({
    data: marcos.map(m => ({
      codProjeto: projeto.codProjeto,
      codMarcoRecomendado: m.codMarcoRecomendado,
      descricao: m.descricao || null,
      descrDetAjustes: m.descrDetAjustes ?? '',
      valorEstimado: m.valorEstimado || null,
      dataConclusao: m.dataConclusao || null,
    })),
  })

  return {
    mensagem: 'Projeto criado com sucesso!',
    projetoId: projeto.codProjeto,
  }
}

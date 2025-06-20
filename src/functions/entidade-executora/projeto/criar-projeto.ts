import prisma from '../../../lib/prisma'

interface ExecucaoMarcoInput {
  codMarcoRecomendado: number
  descricao: string
  valorEstimado: number
  dataConclusao: Date
}

interface CriarProjetoParams {
  titulo: string
  objetivo: string
  acoes: string
  cronograma: string
  orcamento: number
  codPropriedade: number
  codTipoProjeto: number
  CodMicroBacia: number
  codUsuario: number
  marcos: ExecucaoMarcoInput[]
}

export async function criarProjeto({
  titulo,
  objetivo,
  acoes,
  cronograma,
  orcamento,
  codPropriedade,
  codTipoProjeto,
  CodMicroBacia,
  codUsuario,
  marcos,
}: CriarProjetoParams) {
  const entExec = await prisma.entidadeexecutora.findFirst({
    where: {
      codUsuario,
    },
  })

  if (!entExec) {
    throw new Error(
      'Entidade executora não encontrada para o usuário informado.'
    )
  }

  const projeto = await prisma.projeto.create({
    data: {
      titulo,
      objetivo,
      acoes,
      cronograma,
      orcamento,
      codPropriedade,
      codTipoProjeto,
      CodEntExec: entExec.codEntExec,
      CodMicroBacia,
    },
  })

  await prisma.execucao_marco.createMany({
    data: marcos.map(marco => ({
      dataConclusao: marco.dataConclusao,
      descricao: marco.descricao,
      valorEstimado: marco.valorEstimado,
      codProjeto: projeto.codProjeto,
      codMarcoRecomendado: marco.codMarcoRecomendado,
    })),
  })

  return { projetoId: projeto.codProjeto }
}

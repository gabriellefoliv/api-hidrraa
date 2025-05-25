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
  codUsuario: number
  CodEntExec: number
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

  return { projetoId: projeto.codProjeto }
}

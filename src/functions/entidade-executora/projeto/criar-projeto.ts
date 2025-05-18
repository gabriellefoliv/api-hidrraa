import prisma from '../../../lib/prisma'

interface CriarProjetoParams {
  titulo: string
  objetivo: string
  acoes: string
  cronograma: string
  orcamento: number
  codPropriedade: number
  codTipoProjeto: number
  CodEntExec: number
  CodMicroBacia: number
}

export async function criarProjeto({
  titulo,
  objetivo,
  acoes,
  cronograma,
  orcamento,
  codPropriedade,
  codTipoProjeto,
  CodEntExec,
  CodMicroBacia,
}: CriarProjetoParams) {
  const projeto = await prisma.projeto.create({
    data: {
      titulo,
      objetivo,
      acoes,
      cronograma,
      orcamento,
      codPropriedade,
      codTipoProjeto,
      CodEntExec,
      CodMicroBacia,
    },
  })

  return { projetoId: projeto.codProjeto }
}

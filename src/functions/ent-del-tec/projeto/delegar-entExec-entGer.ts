import prisma from '../../../lib/prisma'

interface DelegarEntExecEntGerParams {
  codProjeto: number
  CodEntExec: number
  codEntGer: number
}

export async function DelegarEntExecEntGer({
  codProjeto,
  CodEntExec,
  codEntGer,
}: DelegarEntExecEntGerParams) {
  const projeto = await prisma.projeto.findUnique({
    where: {
      codProjeto,
      dataSubmissao: {
        not: null,
      },
    },
  })

  if (!projeto) {
    throw new Error('Projeto não encontrado ou não submetido.')
  }

  if (projeto.CodEntExec && projeto.codEntGer) {
    throw new Error(
      'Projeto já possui entidade executora e gestora atribuídas.'
    )
  }

  return prisma.projeto.update({
    where: { codProjeto },
    data: {
      CodEntExec,
      codEntGer,
    },
  })
}

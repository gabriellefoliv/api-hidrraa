import prisma from '../../../lib/prisma'

interface ListarProjetosAprovadosParams {
  codUsuario: number
}

export async function listarProjetosAprovados({
  codUsuario,
}: ListarProjetosAprovadosParams) {
  const ent = await prisma.entidadeexecutora.findFirst({
    where: {
      codUsuario,
    },
  })

  if (!ent) {
    throw new Error(
      'Entidade executora não encontrada para o usuário fornecido.'
    )
  }

  const projetos = await prisma.projeto.findMany({
    where: {
      CodEntExec: ent.codEntExec,
      dataSubmissao: {
        not: null,
      },
      titulo: { not: null },
      objetivo: { not: null },
      acoes: { not: null },
      cronograma: { not: null },
    },
    include: {
      tipo_projeto: {
        include: {
          marco_recomendado: {
            include: {
              execucao_marco: true,
            },
          },
        },
      },
      microbacia: true,
      entidadeexecutora: true,
    },
    orderBy: {
      dataSubmissao: 'desc',
    },
  })

  return projetos
}

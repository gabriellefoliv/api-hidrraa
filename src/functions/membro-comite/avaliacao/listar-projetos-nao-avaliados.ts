import prisma from '../../../lib/prisma'

export async function listarProjetosNaoAvaliados() {
  const projetos = await prisma.projeto.findMany({
    where: {
      avaliacao: {
        none: {},
      },
    },
    select: {
      codProjeto: true,
      titulo: true,
      objetivo: true,
      acoes: true,
      cronograma: true,
      orcamento: true,
      tipo_projeto: {
        select: {
          nome: true,
          descricao: true,
          marco_recomendado: {
            select: {
              descricao: true,
              valorEstimado: true,
            },
          },
        },
      },
      entidadeexecutora: {
        select: {
          nome: true,
        },
      },
      microbacia: {
        select: {
          Nome: true,
        },
      },
    },
    orderBy: {
      titulo: 'asc',
    },
  })

  return projetos
}

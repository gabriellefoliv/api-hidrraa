import prisma from '../../../lib/prisma'

export function listarProjetosAprovados() {
  return prisma.projeto.findMany({
    where: {
      avaliacao: {
        some: {
          bc_aprovado: true,
        },
        none: {
          bc_aprovado: false,
        },
      },
      dataSubmissao: {
        not: null,
      },
      titulo: { not: null },
      objetivo: { not: null },
      acoes: { not: null },
      cronograma: { not: null },
    },
    include: {
      avaliacao: true,
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
}

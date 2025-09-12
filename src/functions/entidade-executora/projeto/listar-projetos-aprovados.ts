import prisma from '../../../lib/prisma'

export function listarProjetosAprovados() {
  return prisma.projeto.findMany({
    where: {
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
}

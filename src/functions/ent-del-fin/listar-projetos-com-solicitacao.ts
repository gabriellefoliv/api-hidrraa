import prisma from '../../lib/prisma'

export async function listarProjetosComSolicitacoes() {
  return prisma.projeto.findMany({
    where: {
      execucao_marco: {
        some: {
          pagto_marco_concluido: {
            some: {},
          },
        },
      },
    },
    select: {
      codProjeto: true,
      titulo: true,
      orcamento: true,
      objetivo: true,
      acoes: true,
      cronograma: true,

      execucao_marco: {
        where: {
          pagto_marco_concluido: {
            some: {},
          },
        },
        select: {
          codExecucaoMarco: true,
          descricao: true,
          valorEstimado: true,
          dataConclusaoEfetiva: true,
          pagto_marco_concluido: {
            select: {
              codPagtoMarco: true,
              CodEntExec: true,
              bc_data: true,
            },
          },
        },
      },
    },
  })
}

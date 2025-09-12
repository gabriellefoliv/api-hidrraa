import prisma from '../../../lib/prisma'

interface ListarEvidenciasAvaliadasParams {
  codProjeto: number
}

export function listarEvidenciasAvaliadas({
  codProjeto,
}: ListarEvidenciasAvaliadasParams) {
  return prisma.projeto.findFirst({
    where: {
      codProjeto,
    },
    select: {
      titulo: true,
      objetivo: true,
      cronograma: true,
      acoes: true,
      orcamento: true,
      dataSubmissao: true,
      execucao_marco: {
        where: {
          evidencia_apresentada: {
            some: {},
          },
        },
        select: {
          codExecucaoMarco: true,
          descricao: true,
          valorEstimado: true,
          bc_statusValidacaoCBH: true,
          descrDetAjustes: true,
          dataConclusaoEfetiva: true,
          evidencia_apresentada: {
            select: {
              codEvidenciaApresentada: true,
              caminhoArquivo: true,
              dataUpload: true,
              codEvidenciaDemandada: true,
            },
            orderBy: {
              dataUpload: 'desc',
            },
          },
        },
        orderBy: {
          dataConclusaoEfetiva: 'desc',
        },
      },
      avaliacao: {
        select: {
          bc_valorPagto: true,
        },
      },
    },
  })
}

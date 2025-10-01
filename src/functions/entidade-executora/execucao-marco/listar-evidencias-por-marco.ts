import prisma from '../../../lib/prisma'

interface ListarEvidenciasParams {
  codProjeto: number
  codExecucaoMarco: number
}

export async function listarEvidenciasPorMarco({
  codProjeto,
  codExecucaoMarco,
}: ListarEvidenciasParams) {
  const execucao = await prisma.execucao_marco.findUnique({
    where: {
      codExecucaoMarco,
      codProjeto,
    },
    select: {
      codExecucaoMarco: true,
      descricao: true,
      dataConclusaoEfetiva: true,
      bc_statusValidacaoCBH: true,

      evidencia_apresentada: {
        select: {
          codEvidenciaApresentada: true,
          caminhoArquivo: true,
          dataUpload: true,
          codEvidenciaDemandada: true,
        },
        orderBy: { dataUpload: 'desc' },
      },

      relatorio_gerenciadora: {
        select: {
          codRelGer: true,
          caminhoArquivo: true,
          dataUpload: true,
        },
        orderBy: { dataUpload: 'desc' },
      },
    },
  })

  return execucao
}

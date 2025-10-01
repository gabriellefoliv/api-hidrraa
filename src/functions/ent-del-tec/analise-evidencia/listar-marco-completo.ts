import prisma from '../../../lib/prisma'

interface ListarMarcosCompletosParams {
  codProjeto: number
}

export async function listarMarcosCompletos({
  codProjeto,
}: ListarMarcosCompletosParams) {
  const execucoesComEvidencias = await prisma.execucao_marco.findMany({
    where: {
      codProjeto,
      dataConclusaoEfetiva: {
        not: null,
      },
      evidencia_apresentada: {
        some: {},
      },
      relatorio_gerenciadora: {
        some: {},
      },
    },
    select: {
      codExecucaoMarco: true,
      descricao: true,
      bc_statusValidacaoCBH: true,
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
      relatorio_gerenciadora: {
        select: {
          codRelGer: true,
          caminhoArquivo: true,
          dataUpload: true,
        },
        orderBy: {
          dataUpload: 'desc',
        },
      },
    },
    orderBy: {
      dataConclusaoEfetiva: 'desc',
    },
  })

  return execucoesComEvidencias
}

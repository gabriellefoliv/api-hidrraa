import prisma from '../../lib/prisma'

interface ListarEvidenciasSubmetidasParams {
  codProjeto: number
  codExecucaoMarco: number
}

export async function listarEvidenciasSubmetidas({
  codProjeto,
  codExecucaoMarco,
}: ListarEvidenciasSubmetidasParams) {
  const execucoesComEvidencias = await prisma.execucao_marco.findMany({
    where: {
      codProjeto,
      codExecucaoMarco,
      dataConclusaoEfetiva: {
        not: null,
      },
      evidencia_apresentada: {
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
      },
    },
    orderBy: {
      dataConclusaoEfetiva: 'desc',
    },
  })

  return execucoesComEvidencias
}

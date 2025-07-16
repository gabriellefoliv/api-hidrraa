import prisma from '../../../lib/prisma'

interface ListarEvidenciasParams {
  codProjeto: number
  codExecucaoMarco: number
}

export async function listarEvidenciasPorMarco({
  codProjeto,
  codExecucaoMarco,
}: ListarEvidenciasParams) {
  const evidencias = await prisma.evidencia_apresentada.findMany({
    where: {
      execucao_marco: {
        codProjeto,
        codExecucaoMarco,
      },
    },
    select: {
      codEvidenciaApresentada: true,
      caminhoArquivo: true,
      dataUpload: true,
      codEvidenciaDemandada: true,
      execucao_marco: {
        select: {
          dataConclusaoEfetiva: true,
        },
      },
    },
    orderBy: {
      dataUpload: 'desc',
    },
  })

  return evidencias
}

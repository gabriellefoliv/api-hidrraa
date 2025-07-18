import prisma from '../../../lib/prisma'

interface ListarEvidenciasSubmetidasParams {
  codProjeto: number
}

export async function listarEvidenciasSubmetidas({
  codProjeto,
}: ListarEvidenciasSubmetidasParams) {
  const execucoesComEvidencias = await prisma.execucao_marco.findMany({
    where: {
      codProjeto,
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
    },
    orderBy: {
      dataConclusaoEfetiva: 'desc',
    },
  })

  return execucoesComEvidencias
}

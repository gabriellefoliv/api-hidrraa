import prisma from '../../lib/prisma'

interface RelatorioParams {
  codProjeto: number
  codExecucaoMarco: number
  filePath: string
  codEntGer: number
}

export async function enviarRelatorio({
  codProjeto,
  codExecucaoMarco,
  filePath,
  codEntGer,
}: RelatorioParams) {
  const execucaoMarco = await prisma.execucao_marco.findUnique({
    where: { codExecucaoMarco },
    select: { dataConclusaoEfetiva: true },
  })

  if (!execucaoMarco) {
    throw new Error('Execução de marco não encontrada')
  }

  if (execucaoMarco.dataConclusaoEfetiva === null) {
    throw new Error(
      'Não é possível enviar relatório antes da submissão das evidências.'
    )
  }

  const relatorio = await prisma.relatorio_gerenciadora.create({
    data: {
      codExecucaoMarco,
      caminhoArquivo: filePath,
      codEntGer,
      dataUpload: new Date(),
    },
  })

  return relatorio
}

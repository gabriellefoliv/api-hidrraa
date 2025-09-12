import prisma from '../../../lib/prisma'

interface EvidenciaPayload {
  codProjeto: number
  codExecucaoMarco: number
  codEvidenciaDemandada: number
  tipo: 'fotos' | 'documentos'
  filePath: string
}

export async function apresentarEvidencia({
  codProjeto,
  codExecucaoMarco,
  codEvidenciaDemandada,
  tipo,
  filePath,
}: EvidenciaPayload) {
  const execucaoMarco = await prisma.execucao_marco.findUnique({
    where: { codExecucaoMarco },
    select: { dataConclusaoEfetiva: true },
  })

  if (!execucaoMarco) {
    throw new Error('Execução de marco não encontrada')
  }

  if (execucaoMarco.dataConclusaoEfetiva !== null) {
    throw new Error(
      'Não é possível enviar evidências após a conclusão do marco.'
    )
  }

  const evidencia = await prisma.evidencia_apresentada.create({
    data: {
      caminhoArquivo: filePath,
      codExecucaoMarco,
      codEvidenciaDemandada,
      dataUpload: new Date(),
    },
  })

  return evidencia
}

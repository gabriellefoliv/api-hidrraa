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
  const avaliacao = await prisma.avaliacao.findFirst({
    where: {
      codProjeto,
      bc_aprovado: true,
    },
  })

  if (!avaliacao) {
    throw new Error('Projeto não aprovado ou inexistente')
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

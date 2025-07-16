import fs from 'node:fs/promises'
import path from 'node:path'
import prisma from '../../../lib/prisma'

export async function excluirEvidencia(codEvidenciaApresentada: number) {
  const evidencia = await prisma.evidencia_apresentada.findUnique({
    where: { codEvidenciaApresentada },
  })

  if (!evidencia) {
    throw new Error('Evidência não encontrada')
  }

  const isConfirmed = await prisma.execucao_marco.findFirst({
    where: {
      codExecucaoMarco: evidencia.codExecucaoMarco,
      dataConclusaoEfetiva: {
        not: null,
      },
    },
  })

  if (isConfirmed) {
    throw new Error(
      'Não é possível excluir evidências após a confirmação do marco.'
    )
  }

  const caminhoRelativo = evidencia.caminhoArquivo
  const caminhoAbsoluto = path.resolve('uploads', caminhoRelativo)

  try {
    await fs.unlink(caminhoAbsoluto)
  } catch (err) {
    console.warn(`Arquivo não encontrado ou já excluído: ${caminhoAbsoluto}`)
  }

  await prisma.evidencia_apresentada.delete({
    where: { codEvidenciaApresentada },
  })

  return {
    mensagem: 'Evidência excluída com sucesso!',
  }
}

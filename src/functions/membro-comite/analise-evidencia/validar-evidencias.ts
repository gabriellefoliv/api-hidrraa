import prisma from '../../../lib/prisma'

interface ValidarEvidenciasParams {
  codExecucaoMarco: number
  status: 'APROVADO' | 'REPROVADO' | 'PENDENTE'
  comentario?: string
}

export async function ValidarEvidencias({
  codExecucaoMarco,
  status,
  comentario,
}: ValidarEvidenciasParams) {
  const execucaoMarco = await prisma.execucao_marco.findUnique({
    where: { codExecucaoMarco },
  })

  if (!execucaoMarco) {
    throw new Error('Marco de execução não encontrado.')
  }

  const updateData = {
    bc_statusValidacaoCBH: status,
    descrDetAjustes: comentario,
    dataConclusaoEfetiva:
      status === 'PENDENTE' ? null : execucaoMarco.dataConclusaoEfetiva,
  }

  await prisma.execucao_marco.update({
    where: { codExecucaoMarco },
    data: updateData,
  })
}

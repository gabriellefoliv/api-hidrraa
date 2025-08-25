import prisma from '../../../lib/prisma'

interface SubmeterEvidenciasParams {
  codExecucaoMarco: number
}

export async function submeterEvidencias({
  codExecucaoMarco,
}: SubmeterEvidenciasParams) {
  const execucaoMarco = await prisma.execucao_marco.findUnique({
    where: { codExecucaoMarco },
  })

  if (!execucaoMarco || execucaoMarco.dataConclusaoEfetiva) {
    throw new Error('Execução de marco não encontrada ou já confirmada.')
  }

  await prisma.execucao_marco.update({
    where: { codExecucaoMarco },
    data: {
      dataConclusaoEfetiva: new Date(),
      bc_statusValidacaoCBH: null,
    },
  })

  return { mensagem: 'Evidências confirmadas com sucesso.' }
}

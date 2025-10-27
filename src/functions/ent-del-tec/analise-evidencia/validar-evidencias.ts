import prisma from '../../../lib/prisma'

interface ValidarEvidenciasParams {
  codExecucaoMarco: number
  status: 'APROVADO' | 'REPROVADO' | 'PENDENTE'
  comentario?: string
  caminhoArquivo?: string
}

export async function ValidarEvidencias({
  codExecucaoMarco,
  status,
  comentario,
  caminhoArquivo,
}: ValidarEvidenciasParams) {
  const execucaoMarco = await prisma.execucao_marco.findUnique({
    where: { codExecucaoMarco },
    select: { dataConclusaoEfetiva: true },
  })

  if (!execucaoMarco) {
    throw new Error('Marco de execução não encontrado.')
  }

  // biome-ignore lint/suspicious/noExplicitAny: <Permitir 'any' para construção dinâmica>
  const updateData: any = {
    bc_statusValidacaoCBH: status,
    descrDetAjustes: comentario,
    dataConclusaoEfetiva:
      status === 'PENDENTE' ? null : execucaoMarco.dataConclusaoEfetiva,
  }

  if (caminhoArquivo !== undefined) {
    updateData.caminhoArquivo = caminhoArquivo
  }

  await prisma.execucao_marco.update({
    where: { codExecucaoMarco },
    data: updateData,
  })
}

// import prisma from '../../../lib/prisma'

// interface ValidarEvidenciasParams {
//   codExecucaoMarco: number
//   status: 'APROVADO' | 'REPROVADO' | 'PENDENTE'
//   comentario?: string
// }

// export async function ValidarEvidencias({
//   codExecucaoMarco,
//   status,
//   comentario,
// }: ValidarEvidenciasParams) {
//   const execucaoMarco = await prisma.execucao_marco.findUnique({
//     where: { codExecucaoMarco },
//   })

//   if (!execucaoMarco) {
//     throw new Error('Marco de execução não encontrado.')
//   }

//   const updateData = {
//     bc_statusValidacaoCBH: status,
//     descrDetAjustes: comentario,
//     dataConclusaoEfetiva:
//       status === 'PENDENTE' ? null : execucaoMarco.dataConclusaoEfetiva,
//   }

//   await prisma.execucao_marco.update({
//     where: { codExecucaoMarco },
//     data: updateData,
//   })
// }

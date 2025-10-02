import prisma from '../../../lib/prisma'

export async function solicitarFinanciamento({
  codExecucaoMarco,
  valorSolicitado,
  codUsuario,
}: {
  codExecucaoMarco: number
  valorSolicitado: number
  codUsuario: number
}) {
  return prisma.$transaction(async tx => {
    const entExec = await tx.entidadeexecutora.findFirst({
      where: { codUsuario },
      select: { codEntExec: true },
    })
    if (!entExec)
      throw new Error('Entidade executora não encontrada para este usuário.')

    const marco = await tx.execucao_marco.findUnique({
      where: { codExecucaoMarco },
      select: { codProjeto: true, valorEstimado: true },
    })
    if (!marco) throw new Error('Marco não encontrado.')

    // Somar pagamentos já solicitados/aprovados
    const aggregatePagamentos = await tx.pagto_marco_concluido.aggregate({
      _sum: { bc_valor: true },
      where: { execucao_marco: { codProjeto: marco.codProjeto } },
    })

    const totalJaPago = aggregatePagamentos._sum.bc_valor ?? 0
    const saldoDisponivel = (marco.valorEstimado ?? 0) - totalJaPago

    if (valorSolicitado > saldoDisponivel) {
      throw new Error(
        `Valor solicitado (R$ ${valorSolicitado.toFixed(2)}) excede o saldo disponível.`
      )
    }

    const novaSolicitacao = await tx.pagto_marco_concluido.create({
      data: {
        codExecucaoMarco,
        bc_valor: valorSolicitado,
        CodEntExec: entExec.codEntExec,
        bc_data: new Date(),
      },
      select: { codPagtoMarco: true },
    })

    return novaSolicitacao
  })
}

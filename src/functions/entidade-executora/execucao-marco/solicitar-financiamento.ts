import prisma from '../../../lib/prisma'

interface ServicoPagamento {
  valor: number
  docNFPath: string
}

export async function solicitarFinanciamento({
  codExecucaoMarco,
  codUsuario,
  valorSolicitado,
  servicos,
}: {
  codExecucaoMarco: number
  codUsuario: number
  valorSolicitado: number
  servicos: ServicoPagamento[]
}) {
  if (valorSolicitado <= 0) {
    throw new Error('O valor solicitado deve ser maior que zero.')
  }
  if (!servicos || servicos.length === 0) {
    throw new Error('Nenhuma nota fiscal (serviço) foi fornecida.')
  }

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

    const aggregatePagamentos = await tx.pagto_marco_concluido.aggregate({
      _sum: { bc_valor: true },
      where: { codExecucaoMarco },
    })

    const totalJaPago = aggregatePagamentos._sum.bc_valor ?? 0
    const saldoDisponivel = (marco.valorEstimado ?? 0) - totalJaPago

    if (valorSolicitado > saldoDisponivel) {
      throw new Error(
        `Valor solicitado (R$ ${valorSolicitado.toFixed(
          2
        )}) excede o saldo disponível do marco (R$ ${saldoDisponivel.toFixed(
          2
        )}).`
      )
    }

    const novaSolicitacao = await tx.pagto_marco_concluido.create({
      data: {
        codExecucaoMarco,
        bc_valor: valorSolicitado,
        CodEntExec: entExec.codEntExec,
        bc_data: new Date(),
      },
      select: {
        codPagtoMarco: true,
        execucao_marco: { select: { codProjeto: true } },
      },
    })

    const servicosData = servicos.map(s => ({
      codExecucaoMarco,
      valor: s.valor,
      docNF: s.docNFPath,
      data: new Date(),
    }))

    await tx.pagto_servico.createMany({
      data: servicosData,
    })

    return {
      ...novaSolicitacao,
      codProjeto: novaSolicitacao.execucao_marco.codProjeto,
    }
  })
}

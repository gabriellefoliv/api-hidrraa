import prisma from '../../../lib/prisma'

interface SolicitarFinanciamentoParams {
  codExecucaoMarco: number
  valorSolicitado: number
  codUsuario: number
}

export async function solicitarFinanciamento({
  codExecucaoMarco,
  valorSolicitado,
  codUsuario,
}: SolicitarFinanciamentoParams) {
  return prisma.$transaction(async tx => {
    // 1. Buscar a Entidade Executora a partir do usuário logado
    const entExec = await tx.entidadeexecutora.findFirst({
      where: { codUsuario },
      select: { codEntExec: true },
    })

    if (!entExec) {
      throw new Error('Entidade executora não encontrada para este usuário.')
    }
    const codEntExec = entExec.codEntExec

    // 2. Buscar o marco e validar a posse usando o codEntExec correto
    const marco = await tx.execucao_marco.findUnique({
      where: { codExecucaoMarco },
      select: { codProjeto: true },
    })

    if (!marco) {
      throw new Error('Marco não encontrado.')
    }

    // 3. Buscar a avaliação e o total já pago em paralelo para otimizar
    const [avaliacao, aggregatePagamentos] = await Promise.all([
      tx.avaliacao.findFirst({
        where: {
          codProjeto: marco.codProjeto,
          bc_aprovado: true,
        },
        select: {
          bc_valorPagto: true,
        },
      }),
      // Somar pagamentos APROVADOS para o cálculo do saldo.
      tx.pagto_marco_concluido.aggregate({
        _sum: {
          bc_valor: true,
        },
        where: {
          execucao_marco: {
            codProjeto: marco.codProjeto,
          },
        },
      }),
    ])

    // 4. Validar o orçamento
    const valorLiberado = avaliacao?.bc_valorPagto
    if (!valorLiberado) {
      throw new Error(
        'Nenhuma avaliação aprovada ou valor de pagamento definido para o projeto deste marco.'
      )
    }

    const totalJaPago = aggregatePagamentos._sum.bc_valor ?? 0
    const saldoDisponivel = valorLiberado - totalJaPago

    if (valorSolicitado > saldoDisponivel) {
      throw new Error(
        `Valor solicitado (R$ ${valorSolicitado.toFixed(
          2
        )}) excede o saldo disponível do projeto (R$ ${saldoDisponivel.toFixed(
          2
        )}).`
      )
    }

    // 5. Criar o registro de pagamento com status PENDENTE
    const novaSolicitacao = await tx.pagto_marco_concluido.create({
      data: {
        codExecucaoMarco,
        bc_valor: valorSolicitado,
        CodEntExec: codEntExec,
        bc_data: new Date(),
      },
      select: {
        codPagtoMarco: true,
      },
    })

    return novaSolicitacao
  })
}

// import prisma from '../../../lib/prisma'

// interface SolicitarFinanciamentoParams {
//   codExecucaoMarco: number
//   bc_valor: number
// }

// export async function SolicitarFinanciamento({
//   codExecucaoMarco,
//   bc_valor,
// }: SolicitarFinanciamentoParams) {
//   const valorLimite = await prisma.execucao_marco.findFirst({
//     include: {
//       projeto: {
//         include: {
//           avaliacao: {
//             select: {
//               bc_valorPagto: true,
//             },
//           },
//         },
//       },
//     },
//   })

//   if (!valorLimite) {
//     throw new Error('Limite de valor não encontrado.')
//   }

//   const limitePermitido = valorLimite.projeto.avaliacao[0]?.bc_valorPagto
//   if (limitePermitido === undefined) {
//     throw new Error('Limite de valor do pagamento não encontrado.')
//   }
//   if (bc_valor > limitePermitido) {
//     throw new Error('Valor do financiamento ultrapassa o limite permitido.')
//   }

//   const financiamento = await prisma.pagto_marco_concluido.create({
//     data: {
//       bc_valor,
//       codExecucaoMarco,
//       bc_data: new Date(),
//     },
//   })

//   return financiamento
// }

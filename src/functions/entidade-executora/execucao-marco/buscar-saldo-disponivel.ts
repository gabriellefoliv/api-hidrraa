import prisma from '../../../lib/prisma'

interface BuscarSaldoDisponivelParams {
  codProjeto: number
}

export async function buscarSaldoDisponivel({
  codProjeto,
}: BuscarSaldoDisponivelParams) {
  const [avaliacao, aggregatePagamentos] = await Promise.all([
    prisma.avaliacao.findFirst({
      where: {
        codProjeto,
        bc_aprovado: true,
      },
      select: {
        bc_valorPagto: true,
      },
    }),
    prisma.pagto_marco_concluido.aggregate({
      _sum: {
        bc_valor: true,
      },
      where: {
        execucao_marco: {
          codProjeto,
        },
        // Opcional: Adicionar um status para somar apenas pagamentos 'APROVADOS'
        // status: 'APROVADO'
      },
    }),
  ])

  const valorLiberado = avaliacao?.bc_valorPagto ?? 0
  const totalJaPago = aggregatePagamentos._sum.bc_valor ?? 0
  const saldoDisponivel = valorLiberado - totalJaPago

  return { saldoDisponivel }
}

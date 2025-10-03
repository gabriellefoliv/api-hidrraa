import prisma from '../../../lib/prisma'

interface BuscarSaldoDisponivelParams {
  codProjeto: number
}

export async function buscarSaldoDisponivel({
  codProjeto,
}: BuscarSaldoDisponivelParams) {
  const [projeto, aggregatePagamentos] = await Promise.all([
    prisma.projeto.findFirst({
      where: {
        codProjeto,
      },
      select: {
        orcamento: true,
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
      },
    }),
  ])

  const valorLiberado = projeto?.orcamento ?? 0
  const totalJaPago = aggregatePagamentos._sum.bc_valor ?? 0
  const saldoDisponivel = valorLiberado - totalJaPago

  return { saldoDisponivel }
}

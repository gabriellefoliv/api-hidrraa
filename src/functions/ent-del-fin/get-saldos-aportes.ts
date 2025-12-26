import prisma from '../../lib/prisma'

export async function getSaldosAportes() {
    const aportes = await prisma.aporte.findMany({
        include: {
            alocacoes: true,
            investidor_esg: true,
        },
        where: {
            validadoAGEVAP: true
        }
    })

    return aportes.map(aporte => {
        const totalAlocado = aporte.alocacoes.reduce((acc, curr) => acc + curr.valor, 0)
        const saldoDisponivel = aporte.bc_valor - totalAlocado

        return {
            codAporte: aporte.codAporte,
            investidor: aporte.investidor_esg.razaoSocial,
            valorTotal: aporte.bc_valor,
            totalAlocado,
            saldoDisponivel,
            dataInvestimento: aporte.dataInvestimento
        }
    }).filter(a => a.saldoDisponivel > 0)
}

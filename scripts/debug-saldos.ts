import prisma from '../src/lib/prisma'

async function main() {
    console.log('--- Debugging Saldos Aportes ---')

    const aportes = await prisma.aporte.findMany({
        include: {
            alocacoes: true,
            investidor_esg: true,
        },
    })

    console.log(`Total de Aportes encontrados: ${aportes.length}`)

    for (const aporte of aportes) {
        const totalAlocado = aporte.alocacoes.reduce((acc, curr) => acc + curr.valor, 0)
        const saldoDisponivel = aporte.bc_valor - totalAlocado

        console.log(`
    ID: ${aporte.codAporte}
    Investidor: ${aporte.investidor_esg?.razaoSocial || 'N/A'}
    Valor (bc_valor): ${aporte.bc_valor}
    Validado AGEVAP: ${aporte.validadoAGEVAP}
    Total Alocado: ${totalAlocado}
    Saldo Disponível: ${saldoDisponivel}
    Alocações: ${aporte.alocacoes.length}
    `)
    }
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })

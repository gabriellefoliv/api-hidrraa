import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Simulating Payment Allocation Logic...')

    // Step 1: List Available Aportes (Logic from pagamento.repository.ts)
    const aportes = await prisma.aporte.findMany({
        where: { validadoAGEVAP: true },
        orderBy: { dataInvestimento: 'asc' },
        include: { alocacoes: true }
    })

    console.log(`Found ${aportes.length} validated aportes.`)

    // Step 2: Calculate Available Balance (Logic from pagamento.service.ts)
    const aportesComSaldo = aportes.map(a => {
        const usado = a.alocacoes.reduce((acc, curr) => acc + curr.valor, 0)
        const disponivel = a.bc_valor - usado
        return {
            codAporte: a.codAporte,
            bc_valor: a.bc_valor,
            usado,
            disponivel
        }
    }).filter(a => a.disponivel > 0.001)

    console.log('Aportes with Saldo:', JSON.stringify(aportesComSaldo, null, 2))

    // Step 3: Simulate Allocation for R$ 25
    const valorPagamento = 25
    let valorRestante = valorPagamento
    const novasAlocacoes: { codAporte: number, valor: number }[] = []

    for (const aporte of aportesComSaldo) {
        if (valorRestante <= 0.0001) break
        const valorAUsar = Math.min(valorRestante, aporte.disponivel)
        novasAlocacoes.push({ codAporte: aporte.codAporte, valor: valorAUsar })
        valorRestante -= valorAUsar
    }

    console.log(`Simulating Payment of R$ ${valorPagamento}`)
    console.log('Novas Alocacoes:', novasAlocacoes)
    console.log('Valor Restante:', valorRestante)

    if (valorRestante > 0.001) {
        console.error('FAILURE: Saldo Insuficiente!')
    } else {
        console.log('SUCCESS: Allocation possible.')
    }
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })

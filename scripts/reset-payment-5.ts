import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Reseting Payment 5 data...')

    // 1. Delete Transaction
    await prisma.transacao_blockchain.deleteMany({
        where: { codPagtoMarco: 5 }
    })
    console.log('Deleted Transactions.')

    // 2. Delete Allocations
    // Allocations don't store codPagtoMarco directly, but they are created at the same time.
    // We can find them by referencing the project/aporte/time or clean up manually.
    // Ideally, alocacao_recurso should link to the payment, but it links to project.
    // For this test, I will delete the allocations created "recently" for this project.

    const recentAllocations = await prisma.alocacao_recurso.findMany({
        where: { codProjeto: 4 },
        orderBy: { data: 'desc' },
        take: 1
    })

    for (const aloc of recentAllocations) {
        await prisma.alocacao_recurso.delete({
            where: { codAlocacao: aloc.codAlocacao }
        })
        console.log(`Deleted Allocation ${aloc.codAlocacao}`)
    }

    // 3. Reset the Payment? No, the payment request stays ("Solicitado"), we just deleted the confirmation artifacts.
    // Actually, pagto_marco_concluido holds the "Solicitation". The Confirmation adds the "Transacao".
    // So we don't delete the payment itself. We just deleted the PROOF of payment (Transaction/Allocation).

    console.log('Reset Complete.')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })

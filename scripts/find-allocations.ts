import prisma from '../src/lib/prisma'

async function main() {
    console.log('--- Finding Recent Allocations ---')

    const alocacoes = await prisma.alocacao_recurso.findMany({
        orderBy: { data: 'desc' },
        take: 5,
        include: {
            aporte: true
        }
    })

    console.log(alocacoes)
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })

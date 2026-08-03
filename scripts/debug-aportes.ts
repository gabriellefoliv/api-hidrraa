import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Checking ALL aportes...')

    const aportes = await prisma.aporte.findMany({
        orderBy: { dataInvestimento: 'desc' },
    })

    console.log('All Aportes:', JSON.stringify(aportes, null, 2))
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })

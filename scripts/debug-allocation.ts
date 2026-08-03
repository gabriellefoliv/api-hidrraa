import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Checking recent allocations...')

    const allocations = await prisma.alocacao_recurso.findMany({
        orderBy: { data: 'desc' },
        take: 5,
        include: {
            projeto: true,
            aporte: true
        }
    })

    console.log('Recent Allocations:', JSON.stringify(allocations, null, 2))

    console.log('Checking recent payments...')
    const payments = await prisma.pagto_marco_concluido.findMany({
        orderBy: { bc_data: 'desc' },
        take: 5,
        include: {
            transacoes: true
        }
    })
    console.log('Recent Payments:', JSON.stringify(payments, null, 2))
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })

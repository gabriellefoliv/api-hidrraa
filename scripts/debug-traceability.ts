import prisma from '../src/lib/prisma'

async function main() {
    const codAporte = 7
    console.log(`--- Debugging Traceability for Aporte ${codAporte} ---`)

    const aporte = await prisma.aporte.findUnique({
        where: { codAporte },
        include: {
            alocacoes: true
        }
    })

    if (!aporte) {
        console.log('Aporte NÃO encontrado no banco.')
    } else {
        console.log('Aporte encontrado:', aporte)
        console.log('Alocações:', aporte.alocacoes)
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

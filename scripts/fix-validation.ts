import prisma from '../src/lib/prisma'

async function main() {
    console.log('--- Validating Aporte 11 ---')

    const updated = await prisma.aporte.update({
        where: { codAporte: 11 },
        data: { validadoAGEVAP: true }
    })

    console.log(`Aporte 11 atualizado: Validado=${updated.validadoAGEVAP}`)
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })

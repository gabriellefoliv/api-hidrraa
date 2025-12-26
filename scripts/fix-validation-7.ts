import prisma from '../src/lib/prisma'

async function main() {
    console.log('--- Validating Aporte 7 ---')

    const updated = await prisma.aporte.update({
        where: { codAporte: 7 },
        data: { validadoAGEVAP: true }
    })

    console.log(`Aporte 7 atualizado: Validado=${updated.validadoAGEVAP}`)
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })

import { pagamentoService } from '../src/modules/pagamento/pagamento.service'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Attempting to confirm Payment 5...')

    try {
        const result = await pagamentoService.confirmPaymentWithAllocation(5)
        console.log('Success!', JSON.stringify(result, null, 2))
    } catch (error: any) {
        console.error('Error confirming payment:', error.message)
        console.error(error)
    }
}

main()
    .finally(async () => {
        await prisma.$disconnect()
    })

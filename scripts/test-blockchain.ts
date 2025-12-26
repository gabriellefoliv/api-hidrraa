import { registrarAporteBlockchain } from '../src/functions/investidor/registrar-aporte-blockchain'
import { env } from '../src/env'

async function main() {
    console.log('Starting Manual Blockchain Test...')

    // Mock Data
    const codUsuario = 7 // Ensure this user exists in your DB or mock the DB call inside if needed
    const bc_valor = 100 // 1.00 BRL (100 cents)
    const aporteId = 99999 // Dummy ID
    const stripePaymentIntentId = 'pi_test_123456789'

    try {
        console.log('Calling registrarAporteBlockchain...')
        const receipt = await registrarAporteBlockchain({
            codUsuario,
            bc_valor,
            aporteId,
            stripePaymentIntentId,
        })
        console.log('Success! Receipt status:', receipt.status.toString())
    } catch (error) {
        console.error('Error during blockchain registration:', error)
    }
}

main()

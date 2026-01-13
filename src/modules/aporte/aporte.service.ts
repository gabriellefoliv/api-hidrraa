import Stripe from 'stripe'
import { env } from '../../env'
import { registrarAporteBlockchain } from './aporte.blockchain'
import { aporteRepository } from './aporte.repository'

const stripe = new Stripe(env.STRIPE_SECRET_KEY)

export const aporteService = {
    createPaymentIntent: async (amount: number, codUsuario: number) => {
        return stripe.paymentIntents.create({
            amount,
            currency: 'brl',
            automatic_payment_methods: { enabled: true },
            metadata: { codUsuario: codUsuario.toString() },
        })
    },

    handleStripeWebhook: async (
        rawBody: Buffer,
        signature: string,
        webhookSecret: string
    ) => {
        let event: Stripe.Event
        try {
            event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret)
        } catch (err) {
            throw new Error(`Webhook Error: ${(err as Error).message}`)
        }

        if (event.type === 'payment_intent.succeeded') {
            const paymentIntent = event.data.object as Stripe.PaymentIntent
            const amount = paymentIntent.amount
            const codUsuarioStr = paymentIntent.metadata.codUsuario
            const codUsuario = Number.parseInt(codUsuarioStr, 10)
            const stripePaymentIntentId = paymentIntent.id

            if (!codUsuario) {
                return { received: true, message: 'codUsuario not found' }
            }

            const investidor = await aporteRepository.findInvestidorByUsuario(codUsuario)
            if (!investidor) throw new Error('Investidor não encontrado.')

            const usuario = await aporteRepository.findUsuarioById(codUsuario)
            if (!usuario) throw new Error('Usuário não encontrado.')

            const novoAporte = await aporteRepository.create({
                codInvestidor: investidor.codInvestidor,
                codCBH: usuario.codCBH,
                bc_valor: amount,
            })

            await registrarAporteBlockchain({
                codUsuario,
                bc_valor: amount,
                aporteId: novoAporte.codAporte,
                stripePaymentIntentId,
            })

            return { received: true, aporteId: novoAporte.codAporte }
        }
        return { received: true, message: 'Unhandled event type' }
    },

    listarAportesRealizados: async (codInvestidor: number) => {
        const aportes = await aporteRepository.findAllByInvestidor(codInvestidor)
        return aportes.map(aporte => {
            const registro = aporte.transacoes?.[0] ?? null
            return {
                codAporte: Number(aporte.codAporte),
                dataInvestimento: new Date(aporte.dataInvestimento),
                bc_valor: Number(aporte.bc_valor),
                validadoAGEVAP: Boolean(aporte.validadoAGEVAP),
                codCBH: Number(aporte.codCBH),
                blockchain: registro ? {
                    registrado: true,
                    data: registro.data ? new Date(registro.data).toISOString() : undefined,
                    hash: registro.hash ?? undefined,
                    explorerUrl: registro.explorerUrl ?? undefined,
                } : { registrado: false }
            }
        })
    },

    listarAportes: async () => {
        return aporteRepository.findAll()
    },

    validarAporte: async (codAporte: number) => {
        return aporteRepository.validate(codAporte)
    },

    getRastreabilidade: async (codAporte: number) => {
        const aporte = await aporteRepository.findByIdWithTraceability(codAporte)
        if (!aporte) throw new Error('Aporte não encontrado')

        return {
            codAporte: aporte.codAporte,
            valorTotal: aporte.bc_valor,
            dataInvestimento: aporte.dataInvestimento,
            txHashAporte: aporte.transacoes[0]?.hash,
            explorerUrlAporte: aporte.transacoes[0]?.explorerUrl,
            alocacoes: aporte.alocacoes.map(aloc => ({
                codAlocacao: aloc.codAlocacao,
                valorAlocado: aloc.valor,
                dataAlocacao: aloc.data,
                txHashAlocacao: aloc.txHash,
                projeto: {
                    codProjeto: aloc.projeto.codProjeto,
                    titulo: aloc.projeto.titulo,
                    pagamentos: aloc.projeto.execucao_marco.flatMap(em =>
                        em.pagto_marco_concluido.map(pagto => ({
                            codPagtoMarco: pagto.codPagtoMarco,
                            valorPago: pagto.bc_valor,
                            dataPagamento: pagto.bc_data,
                            marco: pagto.execucao_marco.marco_recomendado.descricao,
                            txHashPagamento: pagto.transacoes[0]?.hash,
                        }))
                    )
                }
            }))
        }
    }
}

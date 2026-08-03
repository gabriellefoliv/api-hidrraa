import { pagamentoService } from './pagamento.service'

export const confirmPaymentWithAllocationHandler = async (req: any, reply: any) => {
    try {
        const result = await pagamentoService.confirmPaymentWithAllocation(req.params.codPagtoMarco)
        return reply.status(200).send(result)
    } catch (error: any) {
        console.error('Erro confirmar pagamento alocacao:', error)
        return reply.status(error.message.includes('não encontrado') ? 404 : 500).send({ error: error.message })
    }
}

export const confirmSimplePaymentHandler = async (req: any, reply: any) => {
    try {
        const result = await pagamentoService.confirmSimplePayment(req.params.codPagtoMarco)
        return reply.status(200).send(result)
    } catch (error: any) {
        return reply.status(500).send({ error: error.message })
    }
}

export const getSaldosAportesHandler = async (req: any, reply: any) => {
    const result = await pagamentoService.getAporteBalances()
    return reply.status(200).send(result)
}

export const listProjectsWithRequestsHandler = async (req: any, reply: any) => {
    try {
        const result = await pagamentoService.listProjectsWithRequests()
        return reply.status(200).send(result)
    } catch (error: any) {
        return reply.status(500).send({ error: error.message })
    }
}

export const listEvidencesWithRequestsHandler = async (req: any, reply: any) => {
    const result = await pagamentoService.listEvidencesWithRequests(req.params.codProjeto)
    if (!result) return reply.status(404).send({ error: 'Projeto não encontrado' })
    return reply.status(200).send(result)
}

export const getPaymentTransactionHandler = async (req: any, reply: any) => {
    const result = await pagamentoService.getPaymentTransaction(req.params.codPagtoMarco)
    if (result) return reply.status(200).send(result)
    return reply.status(404).send({ error: 'Transação não encontrada' })
}

import { pagamentoRepository } from './pagamento.repository'
import { pagamentoBlockchain } from './pagamento.blockchain'
import prisma from '../../lib/prisma'

export const pagamentoService = {
    confirmPaymentWithAllocation: async (codPagtoMarco: number) => {
        const pagamento = await pagamentoRepository.findPaymentById(codPagtoMarco)
        if (!pagamento || pagamento.bc_valor === null) throw new Error('Pagamento não encontrado ou valor inválido')

        const codProjeto = pagamento.execucao_marco.projeto.codProjeto
        const valorPagamento = pagamento.bc_valor

        const aportes = await pagamentoRepository.listAvailableAportes()

        const aportesComSaldo = aportes.map(a => {
            const usado = a.alocacoes.reduce((acc, curr) => acc + curr.valor, 0)
            const disponivel = a.bc_valor - usado
            return { ...a, disponivel }
        }).filter(a => a.disponivel > 0.001)

        let valorRestante = valorPagamento
        const novasAlocacoes: { codAporte: number, valor: number }[] = []

        for (const aporte of aportesComSaldo) {
            if (valorRestante <= 0.0001) break
            const valorAUsar = Math.min(valorRestante, aporte.disponivel)
            novasAlocacoes.push({ codAporte: aporte.codAporte, valor: valorAUsar })
            valorRestante -= valorAUsar
        }

        if (valorRestante > 0.001) {
            throw new Error(`Saldo insuficiente. Faltam R$ ${valorRestante.toFixed(2)}`)
        }

        const pagtoReceipt = await pagamentoBlockchain.registrarPagamento({
            codPagtoMarco: pagamento.codPagtoMarco,
            valor: pagamento.bc_valor,
            codExecucaoMarco: pagamento.codExecucaoMarco
        })

        for (const aloc of novasAlocacoes) {
            await pagamentoBlockchain.registrarAlocacao({
                codAporte: aloc.codAporte,
                codProjeto: codProjeto,
                valor: aloc.valor
            })
        }

        const allocationData = novasAlocacoes.map(aloc => ({
            ...aloc,
            codProjeto,
            txHash: pagtoReceipt.sequenceNumber
        }))

        const transacao = await pagamentoRepository.createAllocationsAndTransaction(
            allocationData,
            {
                hash: pagtoReceipt.sequenceNumber,
                valor: pagamento.bc_valor,
                data: new Date(pagtoReceipt.timestamp),
                codPagtoMarco: pagamento.codPagtoMarco
            }
        )

        return {
            message: 'Pagamento confirmado e recursos alocados automaticamente (FIFO).',
            transacao: { hash: pagtoReceipt.sequenceNumber },
            alocacoes: novasAlocacoes
        }
    },

    confirmSimplePayment: async (codPagtoMarco: number) => {
        const pagamento = await pagamentoRepository.findPaymentById(codPagtoMarco)
        if (!pagamento || pagamento.bc_valor === null) throw new Error('Pagamento não encontrado')

        const receipt = await pagamentoBlockchain.registrarPagamento({
            codPagtoMarco: pagamento.codPagtoMarco,
            valor: pagamento.bc_valor,
            codExecucaoMarco: pagamento.codExecucaoMarco
        })

        const transacao = await pagamentoRepository.createSimpleTransaction({
            tipo: 'pagamento_marco',
            hash: receipt.sequenceNumber,
            valor: pagamento.bc_valor,
            data: new Date(receipt.timestamp),
            status: 'confirmada',
            codPagtoMarco: pagamento.codPagtoMarco
        })

        return { message: 'Pagamento confirmado.', transacao }
    },

    getAporteBalances: async () => {
        const aportes = await pagamentoRepository.getAporteBalances()
        return aportes.map(aporte => {
            const totalAlocado = aporte.alocacoes.reduce((acc, curr) => acc + curr.valor, 0)
            const saldoDisponivel = aporte.bc_valor - totalAlocado
            return {
                codAporte: aporte.codAporte,
                investidor: aporte.investidor_esg.razaoSocial,
                valorTotal: aporte.bc_valor,
                totalAlocado,
                saldoDisponivel,
                dataInvestimento: aporte.dataInvestimento
            }
        }).filter(a => a.saldoDisponivel > 0)
    },

    getPaymentTransaction: async (codPagtoMarco: number) => {
        return prisma.transacao_blockchain.findFirst({
            where: { codPagtoMarco }
        })
    },

    listProjectsWithRequests: async () => {
        const projects = await pagamentoRepository.listProjectsWithRequests()
        return projects.map(proj => ({
            ...proj,
            tipo_projeto: {
                ...proj.tipo_projeto,
                execucao_marcos: proj.tipo_projeto.marco_recomendado.flatMap(m =>
                    m.execucao_marco
                        .filter(em => em.codProjeto === proj.codProjeto)
                        .map(em => ({
                            descricao: em.descricao,
                            valorEstimado: em.valorEstimado,
                            dataConclusaoPrevista: em.dataConclusaoPrevista
                        }))
                )
            }
        }))
    },

    listEvidencesWithRequests: async (codProjeto: number) => {
        const projeto = await pagamentoRepository.listEvidencesWithRequests(codProjeto)
        if (!projeto) return null

        return {
            ...projeto,
            orcamento: String(projeto.orcamento)
        }
    }
}

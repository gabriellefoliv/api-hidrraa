import { env } from '../../env'
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
            return {
                ...a,
                disponivel,
                investmentHash: a.transacoes[0]?.hash, // Capture Investment Hash (Chain of Custody Input)
                serialNumber: (a as any).serialNumber // NFT Serial
            }
        }).filter(a => a.disponivel > 0.001)

        let valorRestante = valorPagamento

        // Prepare allocations
        const preparedAllocations: { codAporte: number, valor: number, investmentHash?: string, serialNumber?: number }[] = []

        for (const aporte of aportesComSaldo) {
            if (valorRestante <= 0.0001) break
            const valorAUsar = Math.min(valorRestante, aporte.disponivel)
            preparedAllocations.push({
                codAporte: aporte.codAporte,
                valor: valorAUsar,
                investmentHash: aporte.investmentHash,
                serialNumber: aporte.serialNumber
            })
            valorRestante -= valorAUsar
        }

        if (valorRestante > 0.001) {
            throw new Error(`Saldo insuficiente. Faltam R$ ${valorRestante.toFixed(2)}`)
        }

        // 1. Register Allocations on Blockchain FIRST (Generate Hash B)
        const finalizedAllocations: { codAporte: number; valor: number; txHash: string }[] = []

        for (const aloc of preparedAllocations) {
            // If we have a serial, use the Contract Allocate flow.
            // If not (Legacy data), we might fail or fallback. Assuming new data has serial.
            let txHash = 'legacy-no-serial';

            if (aloc.serialNumber) {
                const alocReceipt = await pagamentoBlockchain.registrarAlocacao({
                    codAporte: aloc.codAporte,
                    codProjeto: codProjeto,
                    valor: aloc.valor,
                    sourceTxHash: aloc.investmentHash,
                    serialNumber: aloc.serialNumber
                })
                txHash = alocReceipt.transactionId || alocReceipt.sequenceNumber || 'unknown';
            } else {
                // Fallback for old data? Just skip blockchain for allocation or use HCS legacy?
                // For now, we assume migration happened or we just don't trace on-chain for legacy.
                // Ideally we throw error: "Aporte sem Serial - Migre o dado".
                // But strictly, we log via HCS if needed.
            }

            finalizedAllocations.push({
                codAporte: aloc.codAporte,
                valor: aloc.valor,
                txHash: txHash
            })
        }

        const allocationHashes = finalizedAllocations.map(a => a.txHash)

        // 2. Register Payment on Blockchain (Generate Hash C)
        // Determine Serials to Burn (Fully used) vs Log (Partial)
        const burnSerials: number[] = [];
        const eventItems: { serialNumber: number; valor: number }[] = [];

        for (const aloc of preparedAllocations) {
            if (!aloc.serialNumber) continue;

            const originalAporte = aportesComSaldo.find(a => a.codAporte === aloc.codAporte);
            if (originalAporte) {
                // Check remaining balance AFTER this usage
                // We computed 'disponivel' before. 'valorAUsar' is aloc.valor.
                const remaining = originalAporte.disponivel - aloc.valor;

                // If this allocation exhausts the aporte (approx < 1 cent), we BURN.
                if (remaining < 0.01) {
                    burnSerials.push(aloc.serialNumber);
                } else {
                    eventItems.push({ serialNumber: aloc.serialNumber, valor: aloc.valor });
                }
            }
        }

        // 2a. Execute Logs (Partial)
        for (const item of eventItems) {
            try {
                await pagamentoBlockchain.registrarPagamentoEvento({
                    codPagtoMarco: pagamento.codPagtoMarco,
                    valor: item.valor,
                    serialNumber: item.serialNumber,
                    paymentRef: `Pagto_${pagamento.codPagtoMarco}`
                })
            } catch (e) {
                console.error("Error logging payment event:", e);
                // Non-blocking log error
            }
        }

        // 2b. Execute Burn (Main or Fallback)
        const pagtoReceipt = await pagamentoBlockchain.registrarPagamento({
            codPagtoMarco: pagamento.codPagtoMarco,
            valor: pagamento.bc_valor,
            codExecucaoMarco: pagamento.codExecucaoMarco,
            serialNumbers: burnSerials, // Only burn fully used
            sourceAllocationHashes: allocationHashes
        })

        const paymentHash = pagtoReceipt.transactionId || pagtoReceipt.sequenceNumber || 'unknown';

        // Construct URL
        let explorerUrl = '';
        if (pagtoReceipt.transactionId) {
            explorerUrl = `https://hashscan.io/${env.HEDERA_NETWORK}/transaction/${pagtoReceipt.transactionId}`;
        } else if (pagtoReceipt.sequenceNumber) {
            explorerUrl = `https://hashscan.io/${env.HEDERA_NETWORK}/topic/${env.HEDERA_TOPIC_ID}/message/${pagtoReceipt.sequenceNumber}`;
        }

        // 3. Save everything to DB
        const allocationData = finalizedAllocations.map(aloc => ({
            ...aloc,
            codProjeto,
            txHash: aloc.txHash
        }))

        await pagamentoRepository.createAllocationsAndTransaction(
            allocationData,
            {
                hash: paymentHash,
                explorerUrl: explorerUrl,
                valor: pagamento.bc_valor,
                data: new Date(pagtoReceipt.timestamp),
                codPagtoMarco: pagamento.codPagtoMarco
            }
        )

        return {
            message: 'Pagamento confirmado e recursos rastreados (Investment -> Allocation -> Payment).',
            transacao: {
                hash: paymentHash,
                explorerUrl
            },
            alocacoes: finalizedAllocations
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

        // Construct URL
        let explorerUrl = '';
        if (receipt.transactionId) {
            explorerUrl = `https://hashscan.io/${env.HEDERA_NETWORK}/transaction/${receipt.transactionId}`;
        } else if (receipt.sequenceNumber) {
            explorerUrl = `https://hashscan.io/${env.HEDERA_NETWORK}/topic/${env.HEDERA_TOPIC_ID}/message/${receipt.sequenceNumber}`;
        }

        const transacao = await pagamentoRepository.createSimpleTransaction({
            tipo: 'pagamento_marco',
            hash: receipt.transactionId || receipt.sequenceNumber || 'unknown',
            explorerUrl: explorerUrl,
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

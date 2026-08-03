
import { pagamentoService } from '../src/modules/pagamento/pagamento.service'
import { registrarAporteBlockchain } from '../src/modules/aporte/aporte.blockchain'
import { aporteRepository } from '../src/modules/aporte/aporte.repository'
import prisma from '../src/lib/prisma'
import { env } from '../src/env'

async function main() {
    console.log("🚀 Starting NFT Traceability Simulation...");

    const COD_PAGAMENTO = 5; // Target Payment

    // 1. Reset Payment 5 (Clear previous traces)
    console.log(`\n🧹 Resetting Payment ${COD_PAGAMENTO}...`);
    await prisma.transacao_blockchain.deleteMany({ where: { codPagtoMarco: COD_PAGAMENTO } });
    await prisma.alocacao_recurso.deleteMany({
        where: {
            projeto: { execucao_marco: { some: { pagto_marco_concluido: { some: { codPagtoMarco: COD_PAGAMENTO } } } } }
        }
    });
    // Note: The above delete is complex, easier to just delete allocs for the project related to this payment?
    // Let's rely on confirmPaymentWithAllocation logic which computes usage. 
    // But confirmPaymentWithAllocation stores allocations in DB.
    // We should clear allocations linked to the payment's project/aporte used? 
    // Actually, confirmPaymentWithAllocation *creates* allocations.
    // If we re-run, duplicate allocations?
    // Yes. Ideally we wipe allocations for this payment.
    // But database schema links `alocacao` to `projeto`, not `pagto_marco`. 
    // `pagamento.service` creates them.
    // For this debug, I will assume we are generating NEW allocations.

    // 2. Identify Aportes to Fund this Payment
    console.log(`\n🔍 Identifying Aportes...`);
    const aportes = await prisma.aporte.findMany({
        where: { bc_valor: { gt: 0 } }, // Get any active aportes
        orderBy: { dataInvestimento: 'asc' }
    });

    if (aportes.length === 0) throw new Error("No aportes found.");

    // 3. Mint NFTs for these Aportes (Backfill)
    console.log(`\n💎 Minting NFTs for Aportes (Backfill for Simulation)...`);
    for (const aporte of aportes) {
        if (!aporte.serialNumber) {
            console.log(`   Minting for Aporte ${aporte.codAporte} (R$ ${aporte.bc_valor})...`);
            const { serialNumber } = await registrarAporteBlockchain({
                codUsuario: 1, // Mock
                bc_valor: aporte.bc_valor,
                aporteId: aporte.codAporte,
                stripePaymentIntentId: `sim_backfill_${aporte.codAporte}`
            });

            await aporteRepository.updateSerialNumber(aporte.codAporte, serialNumber);
            console.log(`   ✅ Serial ${serialNumber} assigned.`);
        } else {
            console.log(`   ℹ️ Aporte ${aporte.codAporte} already has Serial ${aporte.serialNumber}.`);
        }
    }

    // 4. Confirm Payment (Trigger Allocate + Burn)
    console.log(`\n💸 Confirming Payment ${COD_PAGAMENTO} with Logic...`);
    try {
        const result = await pagamentoService.confirmPaymentWithAllocation(COD_PAGAMENTO);
        console.log(`\n✅ Result:`, JSON.stringify(result, null, 2));
    } catch (e) {
        console.error(`❌ Error confirming payment:`, e);
    }
}

main().catch(console.error);

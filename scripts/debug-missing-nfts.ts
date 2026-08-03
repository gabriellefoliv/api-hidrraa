
import prisma from '../src/lib/prisma'

async function main() {
    console.log("🔍 Checking Aportes status...");

    const aportes = await prisma.aporte.findMany({
        orderBy: { dataInvestimento: 'desc' },
        take: 10,
        include: {
            transacoes: true
        }
    });

    console.table(aportes.map(a => ({
        id: a.codAporte,
        valor: a.bc_valor,
        data: a.dataInvestimento.toISOString(),
        serialNumber: (a as any).serialNumber,
        hasBlockchainTx: a.transacoes.length > 0
    })));

    const pending = aportes.filter(a => !(a as any).serialNumber || a.transacoes.length === 0);
    console.log(`\n⚠️ Found ${pending.length} pending aportes in the last 10.`);
}

main().catch(console.error);

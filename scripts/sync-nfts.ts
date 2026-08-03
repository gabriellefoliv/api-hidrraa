import {
    TokenMintTransaction,
    TokenId
} from '@hashgraph/sdk'
import { env } from '../src/env'
import { hederaClient } from '../src/lib/hederaClient'
import prisma from '../src/lib/prisma'

async function main() {
    console.log("🚀 Starting NFT Sync (Repair) - Standalone Mode...");

    const client = hederaClient();
    // Hardcoding specific Token ID from Walkthrough to ensure correctness during debug
    const tokenId = '0.0.7615329';

    if (!tokenId) throw new Error("No Token ID in env");

    // Use Raw Query
    const aportesRaw = await prisma.$queryRaw<any[]>`
        SELECT codAporte, bc_valor, dataInvestimento, serialNumber
        FROM aporte
        ORDER BY dataInvestimento ASC
    `;

    let fixedCount = 0;

    for (const aporte of aportesRaw) {
        const serial = aporte.serialNumber;
        const txCount = await prisma.transacao_blockchain.count({ where: { codAporte: aporte.codAporte } });
        const hasTx = txCount > 0;

        if (!serial || !hasTx) {
            console.log(`\n🔧 Fixing Aporte ${aporte.codAporte} (R$ ${aporte.bc_valor})...`);

            if (!serial) {
                try {
                    const idStr = String(aporte.codAporte);
                    const metadatacontent = `Aporte:${idStr}`;
                    const metadata = Buffer.from(metadatacontent);

                    console.log(`   📝 Minting Details: Token=${tokenId}, content="${metadatacontent}", key=${client.operatorAccountId?.toString()}`);

                    const mintTx = await new TokenMintTransaction()
                        .setTokenId(tokenId)
                        .setMetadata([metadata])
                        .execute(client);

                    const receipt = await mintTx.getReceipt(client);
                    const serialNumber = receipt.serials[0].low;
                    const txId = mintTx.transactionId.toString();

                    // Update Aporte (Raw)
                    await prisma.$executeRaw`
                        UPDATE aporte
                        SET serialNumber = ${serialNumber}
                        WHERE codAporte = ${aporte.codAporte}
                    `;

                    // Create Transaction Log (if missing)
                    if (!hasTx) {
                        await prisma.transacao_blockchain.create({
                            data: {
                                hash: txId,
                                explorerUrl: `https://hashscan.io/${env.HEDERA_NETWORK}/transaction/${txId}`,
                                tipo: 'aporte',
                                valor: aporte.bc_valor,
                                data: new Date(),
                                codAporte: aporte.codAporte
                            }
                        });
                    }

                    console.log(`   ✅ Minted Serial #${serialNumber} & Logged Tx`);
                    fixedCount++;
                } catch (e) {
                    console.error(`   ❌ Failed to mint for Aporte ${aporte.codAporte}:`, e);
                }
            } else {
                console.log(`   ℹ️ Has Serial #${serial}. Skipping.`);
            }
        }
    }

    console.log(`\n✨ Sync Complete. Fixed ${fixedCount} aportes.`);
}

main().catch(console.error);

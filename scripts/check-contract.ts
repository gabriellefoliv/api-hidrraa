import { ContractInfoQuery, ContractId } from "@hashgraph/sdk";
import { hederaClient } from "../src/lib/hederaClient";
import { env } from "../src/env";

async function main() {
    const client = hederaClient();
    const contractIdString = env.APORTE_TOKEN_CONTRACT_ADDRESS;

    let contractId;
    if (contractIdString.startsWith('0x')) {
        contractId = ContractId.fromEvmAddress(0, 0, contractIdString);
    } else {
        contractId = ContractId.fromString(contractIdString);
    }

    console.log(`Checking info for Contract: ${contractId.toString()}...`);

    try {
        const info = await new ContractInfoQuery()
            .setContractId(contractId)
            .execute(client);

        console.log(`\n📄 Contract Info:`);
        console.log(`- Account ID: ${info.accountId.toString()}`);
        console.log(`- Admin Key: ${info.adminKey ? info.adminKey.toString() : "NONE (Immutable)"}`);
        console.log(`- Storage: ${info.storage.toString()} bytes`);
        console.log(`- Auto Renew Period: ${info.autoRenewPeriod.toString()}`);
        console.log(`- Max Auto Associations: ${info.maxAutomaticTokenAssociations}`);

        if (!info.adminKey) {
            console.log("\n⚠️ The contract is IMMUTABLE. You cannot associate tokens with it manually.");
        } else {
            console.log("\n✅ The contract has an Admin Key. You should be able to associate it if you have this key.");
        }

    } catch (error) {
        console.error("Error fetching contract info:", error);
    }

    process.exit(0);
}

main();

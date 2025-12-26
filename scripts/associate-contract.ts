import {
    TokenAssociateTransaction,
    ContractId
} from "@hashgraph/sdk";
import { hederaClient } from "../src/lib/hederaClient";
import { env } from "../src/env";

async function main() {
    const client = hederaClient();

    const tokenId = env.HEDERA_TOKEN_ID;
    const contractIdString = env.APORTE_TOKEN_CONTRACT_ADDRESS;

    if (!tokenId || !contractIdString) {
        throw new Error("Missing HEDERA_TOKEN_ID or APORTE_TOKEN_CONTRACT_ADDRESS in .env");
    }

    // Handle EVM Address vs Hedera ID
    let contractId;
    if (contractIdString.startsWith('0x')) {
        contractId = ContractId.fromEvmAddress(0, 0, contractIdString);
    } else {
        contractId = ContractId.fromString(contractIdString);
    }

    console.log(`Associating Contract ${contractId.toString()} with Token ${tokenId}...`);

    try {
        const transaction = await new TokenAssociateTransaction()
            .setAccountId(contractId.toString()) // Associate the CONTRACT
            .setTokenIds([tokenId])
            .freezeWith(client);

        // Sign with the client operator (assuming it's the admin of the contract)
        const signTx = await transaction.sign(client.operatorPrivateKey!);

        const txResponse = await signTx.execute(client);
        const receipt = await txResponse.getReceipt(client);

        console.log(`\n✅ Contract Associated! Status: ${receipt.status.toString()}`);
    } catch (error) {
        console.error("\n❌ Failed to associate contract. Reason:");
        console.error(error);
        console.log("\nPossible causes:");
        console.log("1. The contract does not have an Admin Key.");
        console.log("2. The Admin Key is not your current HEDERA_ACCOUNT_ID.");
        console.log("3. The contract is immutable.");
    }

    process.exit(0);
}

main();

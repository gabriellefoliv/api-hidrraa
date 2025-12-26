import {
    ContractCreateFlow,
    ContractFunctionParameters
} from "@hashgraph/sdk";
import { hederaClient } from "../src/lib/hederaClient";
import { env } from "../src/env";
import fs from "fs";
import path from "path";

async function main() {
    const client = hederaClient();
    const operatorKey = client.operatorPublicKey;

    console.log("Deploying new VaultContract...");

    // Read Bytecode
    const bytecodePath = path.join(__dirname, "../src/abis/src_abis_VaultContract_sol_VaultContract.bin");
    const bytecode = fs.readFileSync(bytecodePath, "utf8");

    // Deploy
    const contractCreate = new ContractCreateFlow()
        .setBytecode(bytecode)
        .setGas(2000000) // 2 Million Gas
        .setMaxAutomaticTokenAssociations(100) // <--- CRITICAL: Allows receiving tokens automatically
        .setAdminKey(operatorKey!); // <--- CRITICAL: Sets YOU as admin

    const txResponse = await contractCreate.execute(client);
    const receipt = await txResponse.getReceipt(client);
    const newContractId = receipt.contractId;

    console.log(`\n✅ Contract Deployed!`);
    console.log(`📝 Contract ID: ${newContractId?.toString()}`);
    console.log(`\n👉 Please update your .env file with this new APORTE_TOKEN_ID (Contract Address).`);

    process.exit(0);
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});

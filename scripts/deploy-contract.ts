import {
    Client,
    ContractCreateFlow,
    ContractFunctionParameters,
    FileCreateTransaction,
    ContractCreateTransaction,
    PrivateKey
} from "@hashgraph/sdk";
import fs from "fs";
import path from "path";
// @ts-ignore
import solc from "solc";
import { env } from "../src/env.ts";

async function main() {
    console.log("🚀 Starting Contract Deployment...");

    const operatorId = env.HEDERA_ACCOUNT_ID;
    const operatorKey = env.HEDERA_PRIVATE_KEY;

    if (!operatorId || !operatorKey) {
        throw new Error("❌ Missing HEDERA_ACCOUNT_ID or HEDERA_PRIVATE_KEY in .env");
    }

    const client = Client.forTestnet();
    client.setOperator(operatorId, operatorKey);

    // 1. Compile Contract
    const contractPath = path.resolve(__dirname, "../src/abis/TraceabilityContract.sol");
    const htsPath = path.resolve(__dirname, "../src/abis/hip-206/HederaTokenService.sol");
    const hrcPath = path.resolve(__dirname, "../src/abis/hip-206/HederaResponseCodes.sol");

    const source = fs.readFileSync(contractPath, "utf8");
    const htsSource = fs.readFileSync(htsPath, "utf8");
    const hrcSource = fs.readFileSync(hrcPath, "utf8");

    console.log(`📜 Compiling ${contractPath}...`);

    const input = {
        language: "Solidity",
        sources: {
            "TraceabilityContract.sol": {
                content: source,
            },
            "hip-206/HederaTokenService.sol": {
                content: htsSource
            },
            "hip-206/HederaResponseCodes.sol": {
                content: hrcSource
            }
        },
        settings: {
            outputSelection: {
                "*": {
                    "*": ["*"],
                },
            },
        },
    };

    const output = JSON.parse(solc.compile(JSON.stringify(input)));

    if (output.errors) {
        // Filter out warnings
        const errors = output.errors.filter((e: any) => e.severity === "error");
        if (errors.length > 0) {
            console.error("❌ Compilation Errors:", errors);
            process.exit(1);
        }
    }

    const contractDef = output.contracts["TraceabilityContract.sol"]["TraceabilityContract"];
    const bytecode = contractDef.evm.bytecode.object;

    console.log(`✅ Compilation Successful! Bytecode length: ${bytecode.length} chars`);

    // 2. Deploy Contract (Manual Flow)
    console.log("📡 Uploading Bytecode to Hedera File Service...");

    // Create file with bytecode
    const fileCreateTx = new FileCreateTransaction()
        .setContents(bytecode)
        .setKeys([client.operatorPublicKey!]) // Admin key to allow deletion/update if needed
        .freezeWith(client);

    // Sign with operator (automatic if client has operator, but good practice to be explicit if using freeze)
    const fileCreateSign = await fileCreateTx.sign(env.HEDERA_PRIVATE_KEY ? PrivateKey.fromString(env.HEDERA_PRIVATE_KEY) : PrivateKey.fromString(operatorKey));
    const fileCreateSubmit = await fileCreateSign.execute(client);
    const fileCreateRx = await fileCreateSubmit.getReceipt(client);
    const bytecodeFileId = fileCreateRx.fileId;

    console.log(`📂 Bytecode File Created: ${bytecodeFileId?.toString()} (Status: ${fileCreateRx.status.toString()})`);

    console.log("🏗️ Instantiating Smart Contract...");

    const contractTx = await new ContractCreateTransaction()
        .setBytecodeFileId(bytecodeFileId!)
        .setGas(5000000)
        .setConstructorParameters(new ContractFunctionParameters().addAddress(client.operatorAccountId!.toSolidityAddress()))
        .setAdminKey(client.operatorPublicKey!) // Optional: allows upgrading/deleting contract
        .execute(client);

    const contractRx = await contractTx.getReceipt(client);
    console.log(`Contract Receipt Status: ${contractRx.status.toString()}`);
    // console.log("Full Receipt:", JSON.stringify(contractRx)); // Debug
    const contractId = contractRx.contractId;

    console.log("-----------------------------------------");
    console.log(`🎉 Contract Deployed Successfully!`);
    console.log(`📜 Contract ID: ${contractId?.toString()}`);
    console.log(`📍 Solidity Address: ${contractId?.toSolidityAddress()}`);
    console.log(`📝 Update your .env file with:`);
    console.log(`APORTE_TOKEN_CONTRACT_ADDRESS=${contractId?.toString()}`);
    console.log("-----------------------------------------");
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});

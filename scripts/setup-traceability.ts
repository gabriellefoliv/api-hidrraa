import {
    TokenCreateTransaction,
    TokenType,
    TokenSupplyType,
    TokenAssociateTransaction,
    PrivateKey,
    Client
} from "@hashgraph/sdk";
import { env } from "../src/env";

async function main() {
    const CONTRACT_ID = process.argv[2]; // Pass Contract ID as argument

    if (!CONTRACT_ID) {
        throw new Error("❌ Please provide the Contract ID as an argument.");
    }

    const operatorId = env.HEDERA_ACCOUNT_ID;
    const operatorKey = env.HEDERA_PRIVATE_KEY;

    if (!operatorId || !operatorKey) {
        throw new Error("❌ Missing HEDERA_ACCOUNT_ID or HEDERA_PRIVATE_KEY in .env");
    }

    const client = Client.forTestnet();
    client.setOperator(operatorId, operatorKey);

    console.log(`🚀 Creating NFT Collection for Traceability...`);

    // 1. Create NFT
    const tokenCreateTx = await new TokenCreateTransaction()
        .setTokenName("Hidra Capital Flow")
        .setTokenSymbol("HCF")
        .setTokenType(TokenType.NonFungibleUnique)
        .setSupplyType(TokenSupplyType.Infinite)
        .setTreasuryAccountId(operatorId)
        .setAdminKey(client.operatorPublicKey!)
        .setSupplyKey(client.operatorPublicKey!)
        .execute(client);

    const tokenRx = await tokenCreateTx.getReceipt(client);
    const tokenId = tokenRx.tokenId;

    console.log(`✅ Token Created: ${tokenId?.toString()}`);

    // 2. Associate Contract with Token
    console.log(`🔗 Associating Contract ${CONTRACT_ID} with Token ${tokenId?.toString()}...`);

    // NOTE: To associate a contract, the transaction must be signed by the Contract's Admin Key.
    // Since we deployed the contract with the Operator Key as Admin, we can sign it here.

    // There is a nuance: TokenAssociateTransaction normally requires the accountId (Contract) to sign.
    // If the contract has an Admin Key, the Admin Key signature is sufficient for some updates, 
    // but for association, the specs say "The account to be associated must sign".
    // For a contract with an admin key, the admin key IS the signature of the account.

    const associateTx = await new TokenAssociateTransaction()
        .setAccountId(CONTRACT_ID)
        .setTokenIds([tokenId!])
        .freezeWith(client);

    const associateSign = await associateTx.sign(PrivateKey.fromString(operatorKey));
    const associateSubmit = await associateSign.execute(client);
    const associateRx = await associateSubmit.getReceipt(client);

    console.log(`✅ Association Status: ${associateRx.status.toString()}`);

    console.log("-----------------------------------------");
    console.log("📝 Update your .env file with:");
    console.log(`HEDERA_TOKEN_ID=${tokenId?.toString()}`);
    console.log(`APORTE_TOKEN_CONTRACT_ADDRESS=${CONTRACT_ID}`);
    console.log("-----------------------------------------");
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});

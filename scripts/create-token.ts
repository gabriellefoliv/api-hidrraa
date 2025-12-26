import {
    TokenCreateTransaction,
    TokenType,
    TokenSupplyType,
    Hbar
} from "@hashgraph/sdk";
import { hederaClient } from "../src/lib/hederaClient";
import { env } from "../src/env";

async function main() {
    const client = hederaClient();
    const operatorId = client.operatorAccountId;
    const operatorKey = client.operatorPublicKey;

    if (!operatorId || !operatorKey) {
        throw new Error("Client configuration error: Operator ID or Key missing.");
    }

    console.log(`Creating new token using account: ${operatorId.toString()}...`);

    const transaction = await new TokenCreateTransaction()
        .setTokenName("Hidra Payment Token")
        .setTokenSymbol("HPT")
        .setTokenType(TokenType.FungibleCommon)
        .setDecimals(2) // 100 cents = 1.00
        .setInitialSupply(0)
        .setTreasuryAccountId(operatorId)
        .setSupplyType(TokenSupplyType.Infinite)
        .setSupplyKey(operatorKey) // <--- CRITICAL: Sets YOUR key as the Supply Key
        .setAdminKey(operatorKey)  // Optional: Allows you to update the token later
        .freezeWith(client);

    const signTx = await transaction.signWithOperator(client);
    const txResponse = await signTx.execute(client);
    const receipt = await txResponse.getReceipt(client);
    const newTokenId = receipt.tokenId;

    console.log(`\n✅ New Token Created!`);
    console.log(`🆔 Token ID: ${newTokenId?.toString()}`);
    console.log(`\n👉 Please update your .env file with this new HEDERA_TOKEN_ID.`);

    process.exit(0);
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});

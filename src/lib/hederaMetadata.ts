/**
 * Helper utility for generating HIP-412 compliant metadata for Hedera NFTs.
 * HIP-412: https://hips.hedera.com/hip/hip-412
 */

export interface TraceabilityMetadata {
    name: string;
    description: string;
    image: string; // IPFS URI or similar
    type: string;
    properties: {
        stripePaymentIntentId: string;
        amount: string;
        currency: string;
        investorHash?: string; // Pseudonymized Investor ID
        timestamp: string;
        [key: string]: any;
    };
    attributes?: Array<{
        trait_type: string;
        value: string | number;
    }>;
}

export function generateTraceabilityMetadata({
    amount,
    currency,
    stripePaymentIntentId,
    investorHash,
    timestamp
}: {
    amount: number;
    currency: string;
    stripePaymentIntentId: string;
    investorHash?: string;
    timestamp: Date;
}): TraceabilityMetadata {
    const formattedAmount = new Intl.NumberFormat('pt-BR', { style: 'currency', currency }).format(amount);

    return {
        name: `Mapeamento Financeiro - ${stripePaymentIntentId.slice(-6)}`,
        description: `Rastreabilidade on-chain para aporte de ${formattedAmount}. Origem: Stripe.`,
        image: "ipfs://bafkreidj26sxhbnc35n53uv5qj5re2d5e5p6p7p7p7p7p7p7p7p7p", // Placeholder generic "Money Map" image
        type: "image/png",
        properties: {
            stripePaymentIntentId,
            amount: amount.toString(),
            currency,
            investorHash: investorHash || "Anonymous",
            timestamp: timestamp.toISOString(),
            source: "Stripe",
            platform: "HIDRAA Antigravity"
        },
        attributes: [
            { trait_type: "Amount", value: amount },
            { trait_type: "Currency", value: currency },
            { trait_type: "Source", value: "Stripe" }
        ]
    };
}

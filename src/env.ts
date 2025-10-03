import z from 'zod'

const envSchema = z.object({
  PORT: z.coerce.number().default(3333),
  STRIPE_SECRET_KEY: z.string().min(1).default(''),
  BACKEND_PRIVATE_KEY: z.string().min(1).default(''),
  APORTE_TOKEN_CONTRACT_ADDRESS: z.string().min(1).default(''),
  STRIPE_WEBHOOK_SECRET: z.string().min(1).default(''),
  // NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().min(1).default(''),
  HEDERA_NETWORK: z.string(),
  HEDERA_ACCOUNT_ID: z.string().min(1),
  HEDERA_PRIVATE_KEY: z.string().min(1),
  HEDERA_TOPIC_ID: z.string().min(1),
})

export const env = envSchema.parse(process.env)

const { Client, PrivateKey } = require('@hashgraph/sdk')
import { env } from '../env'

export function hederaClient() {
  const accountId = env.HEDERA_ACCOUNT_ID
  const privateKeyString = env.HEDERA_PRIVATE_KEY

  if (!accountId || !privateKeyString) {
    throw new Error(
      'HEDERA_ACCOUNT_ID e HEDERA_PRIVATE_KEY precisam estar no .env'
    )
  }

  const privateKey = PrivateKey.fromString(privateKeyString)

  const client = Client.forName(process.env.HEDERA_NETWORK || 'testnet')
  client.setOperator(accountId, privateKey)

  return client
}

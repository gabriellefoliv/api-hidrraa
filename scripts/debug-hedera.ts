import { env } from '../src/env'
import { hederaClient } from '../src/lib/hederaClient'
const { TopicMessageSubmitTransaction } = require('@hashgraph/sdk')

async function main() {
    console.log('Testing Hedera Connection...')
    console.log('Topic ID:', env.HEDERA_TOPIC_ID)

    if (!env.HEDERA_TOPIC_ID) {
        throw new Error('HEDERA_TOPIC_ID is missing in env')
    }

    const client = hederaClient()

    console.log('Client created. Sending test message...')

    const transaction = new TopicMessageSubmitTransaction({
        topicId: env.HEDERA_TOPIC_ID,
        message: "Debug Test Message"
    })

    const response = await transaction.execute(client)
    const receipt = await response.getReceipt(client)

    console.log('Success! Sequence Number:', receipt.topicSequenceNumber.toString())
}

main()
    .catch((e) => {
        console.error('Hedera Test Failed:', e)
        process.exit(1)
    })

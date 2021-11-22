import ws from 'ws'
import { createClient } from 'graphql-ws'
import { setTimeout } from 'timers/promises'

import { getExecuteFunction, printReconnecting } from '../lib/helpers'

const url = 'ws://localhost:4000/'
const client = createClient({
  url,
  webSocketImpl: ws,
  retryWait: async function retry() {
    printReconnecting()
    await setTimeout(2000)
  },
  isFatalConnectionProblem: () => false,
  retryAttempts: Infinity,
})
const execute = getExecuteFunction(client)
const query = 'subscription { userMoved { userId longitude }}'
//const query = 'query { hello }'

;(async () => {
  try {
    const subscription = execute({ query })
    for await (const result of subscription) {
      console.log(result)
    }
  } catch (err) {
    console.error(err)
  }
})()

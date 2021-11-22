import ws from 'ws'
import { createClient } from 'graphql-ws'

import { getExecuteFunction } from '../lib/helpers'

const url = 'ws://localhost:4000/'

const client = createClient({ url, webSocketImpl: ws })

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

import ws from 'ws'
import { createClient } from 'graphql-ws'

const client = createClient({
  url: 'ws://localhost:4000/',
  webSocketImpl: ws,
})

// query
;(async () => {
  const result = await new Promise((resolve, reject) => {
    let result: any
    client.subscribe(
      {
        query: '{ hello }',
      },
      {
        next: (data) => (result = data),
        error: reject,
        complete: () => resolve(result),
      }
    )
  })

  console.log(result)
})()

// subscription
;(async () => {
  const onNext = (d: any) => {
    console.log(d)
  }

  let unsubscribe = () => {
    /* complete the subscription */
  }

  try {
    await new Promise((resolve: any, reject) => {
      unsubscribe = client.subscribe(
        {
          query: 'subscription { userMoved { userId longitude }}',
        },
        {
          next: onNext,
          error: reject,
          complete: resolve,
        }
      )
    })
  } catch (e) {
    console.error(e)
  }
})()

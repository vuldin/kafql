import webSocketImpl from 'ws'
import { ExecutionResult, SubscribePayload, createClient } from 'graphql-ws'
import { randomUUID as generateID } from 'crypto'

const client = createClient({
  url: 'ws://localhost:4000/',
  webSocketImpl,
  generateID,
})

async function execute<T>(payload: SubscribePayload) {
  return new Promise<T>((resolve, reject) => {
    let result: any
    client.subscribe<ExecutionResult>(payload, {
      next: (data) => (result = data),
      error: reject,
      complete: () => resolve(result),
    })
  })
}

let unsubscribe: () => void

async function subscription() {
  await new Promise((resolve: any, reject) => {
    unsubscribe = client.subscribe(
      {
        query: 'subscription { userCreated { id firstname lastname age address } }',
      },
      {
        next: function onNext(nextData) {
          console.log(nextData)
        },
        error: reject,
        complete: resolve,
      }
    )
  })
}
subscription()

async function main() {
  try {
    await execute({
      query:
        '\
      mutation {\
        createUser(input: {\
          firstname: "josh"\
        }) {\
          id\
        }\
      }',
    })
    await execute({
      query:
        '\
      mutation {\
        createUser(input: {\
          firstname: "lane"\
        }) {\
          id\
        }\
      }',
    })
    const queryResult = await execute({
      query:
        'query {\
        users {\
          id\
          firstname\
          lastname\
        }\
      }',
    })
    console.log(queryResult)
  } catch (err) {
    console.error(err)
  }
}
main()

function handleExit() {
  console.log('\nhandling exit...')
  unsubscribe()
}

process.on('SIGINT', handleExit)

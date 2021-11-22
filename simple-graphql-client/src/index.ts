import ws from 'ws'
import { createClient } from 'graphql-ws'
import { setTimeout } from 'timers/promises'

import { getExecuteFunction, printReconnecting } from '../lib/helpers'

const url = 'ws://localhost:4000/'
const client = createClient({
  url,
  webSocketImpl: ws,
  retryWait: async function retry() {
    printReconnecting(url)
    await setTimeout(2000)
  },
  isFatalConnectionProblem: () => false,
  retryAttempts: Infinity,
})
const execute = getExecuteFunction(client)

async function userCreatedEvents() {
  const userCreatedQuery = 'subscription { userCreated { userId latitude longitude patience }}'
  try {
    const subscription = execute({ query: userCreatedQuery })
    for await (const result of subscription) {
      console.log(result)
    }
  } catch (err) {
    console.error(err)
  }
}

async function userMovedEvents() {
  const userMovedQuery = 'subscription { userMoved { userId latitude longitude }}'
  try {
    const subscription = execute({ query: userMovedQuery })
    for await (const result of subscription) {
      console.log(result)
    }
  } catch (err) {
    console.error(err)
  }
}

async function getUsers() {
  const usersQuery = 'query { users { userId latitude longitude patience }}'
  try {
    const subscription = execute({ query: usersQuery })
    for await (const result of subscription) {
      console.log(JSON.stringify(result, null, 1))
    }
  } catch (err) {
    console.error(err)
  }
}

// TODO these functions should only start listening for events
// server should not be creating user or moving user based on these calls
// move user creation and movement to mutations, keep subscriptions for handling events
userCreatedEvents()
userMovedEvents() // kicks off user movement
async function regularlyGetUsers() {
  while (true) {
    await getUsers()
    await setTimeout(4000)
  }
}
regularlyGetUsers()

import { WebSocketServer } from 'ws'
import { useServer } from 'graphql-ws/lib/use/ws'

import { schema } from './schema'

const port = 4000

const server = new WebSocketServer({
  port,
  path: '/',
})

useServer({ schema }, server)

console.log(`Listening on port ${port}`)

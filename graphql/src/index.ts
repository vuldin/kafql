import http from 'http'
import { GRAPHQL_TRANSPORT_WS_PROTOCOL } from 'graphql-ws'
import { GRAPHQL_WS, SubscriptionServer } from 'subscriptions-transport-ws'
import { Socket } from 'net'
import { WebSocketServer } from 'ws'
import { execute, subscribe } from 'graphql'
import { makeExecutableSchema } from '@graphql-tools/schema'
import { useServer } from 'graphql-ws/lib/use/ws'

import models from './models'
import resolvers from './resolvers'
import typeDefs from './typeDefs'

const port = 4000
const path = '/'
const schema = makeExecutableSchema({ typeDefs, resolvers })

//const graphqlWs = new WebSocketServer({ port, path })
const graphqlWs = new WebSocketServer({ noServer: true })
useServer({ context: () => ({ models }), schema }, graphqlWs)

const subTransWs = new WebSocketServer({ noServer: true })
SubscriptionServer.create({ schema, execute, subscribe }, subTransWs)

const server = http.createServer(function weServeSocketsOnly(_, res) {
  res.writeHead(404)
  res.end()
})

// decide which websocket server to use
server.on('upgrade', (req, socket, head) => {
  const protocol = req.headers['sec-websocket-protocol']
  const protocols = Array.isArray(protocol) ? protocol : protocol?.split(',').map((p) => p.trim())
  const wss =
    protocols?.includes(GRAPHQL_WS) && !protocols.includes(GRAPHQL_TRANSPORT_WS_PROTOCOL)
      ? subTransWs
      : graphqlWs
  wss.handleUpgrade(req, socket as Socket, head, (ws) => {
    wss.emit('connection', ws, req)
  })
})

server.listen(4000)

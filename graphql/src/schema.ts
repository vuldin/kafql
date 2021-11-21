import { GraphQLID, GraphQLInt, GraphQLObjectType, GraphQLSchema, GraphQLString } from 'graphql'

const userMovedType = new GraphQLObjectType({
  name: 'userMovedType',
  fields: {
    userId: { type: GraphQLID },
    longitude: { type: GraphQLInt },
  },
})

async function* userMovedSubscription() {
  const vals = [
    { userId: '1a2b3c', longitude: 0 },
    { userId: '1a2b3c', longitude: 1 },
    { userId: '1a2b3c', longitude: 2 },
    { userId: '1a2b3c', longitude: 3 },
    { userId: '1a2b3c', longitude: 4 },
  ]
  for (const val of vals) {
    yield { userMoved: val }
  }
}

export const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: {
      hello: {
        type: GraphQLString,
        resolve: () => 'world',
      },
    },
  }),
  subscription: new GraphQLObjectType({
    name: 'Subscription',
    fields: {
      userMoved: {
        type: userMovedType,
        subscribe: userMovedSubscription,
      },
    },
  }),
})
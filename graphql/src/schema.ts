import {
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from 'graphql'
import { setTimeout } from 'timers/promises'

const userMovedType = new GraphQLObjectType({
  name: 'userMovedType',
  fields: {
    userId: { type: GraphQLID },
    latitude: { type: GraphQLInt },
    longitude: { type: GraphQLInt },
  },
})

const userType = new GraphQLObjectType({
  name: 'userType',
  fields: {
    userId: { type: GraphQLID },
    latitude: { type: GraphQLInt },
    longitude: { type: GraphQLInt },
    patience: { type: GraphQLInt },
  },
})

// TODO move interface and users array out of schema file
interface User {
  userId: string
  latitude: number
  longitude: number
  patience?: number
}

let users: User[] = [
  {
    userId: '1a2b3c',
    latitude: 1,
    longitude: 0,
    patience: 5,
  },
]

// TODO subscribe to userCreated topic
async function* userCreatedEvent() {
  yield {
    userCreated: users[0],
  }
}

// TODO subscribe to userMoved topic
async function* userMovedEvent() {
  const vals = [
    { latitude: 1, longitude: 1 },
    { latitude: 1, longitude: 2 },
    { latitude: 1, longitude: 3 },
    { latitude: 1, longitude: 4 },
    { latitude: 1, longitude: 3 },
    { latitude: 1, longitude: 2 },
    { latitude: 1, longitude: 1 },
    { latitude: 1, longitude: 0 },
  ]

  let num = 0
  while (true) {
    // TODO stop modifying users here (do it in mutation, etc.)
    users[0] = {
      ...users[0],
      ...vals[num % vals.length],
    }
    yield {
      userMoved: {
        userId: users[0].userId,
        ...vals[num % vals.length],
      },
    }
    num += 1
    await setTimeout(2000)
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
      users: {
        type: new GraphQLNonNull(new GraphQLList(userType)),
        resolve: () => users,
      },
      user: {
        type: userType,
        args: {
          userId: { type: GraphQLID },
        },
        resolve: (_, { userId }) => users.filter((user) => user.userId === userId),
      },
    },
  }),
  subscription: new GraphQLObjectType({
    name: 'Subscription',
    fields: {
      userCreated: {
        type: userType,
        subscribe: userCreatedEvent,
      },
      userMoved: {
        type: userMovedType,
        subscribe: userMovedEvent,
      },
    },
  }),
})

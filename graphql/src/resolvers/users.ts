import pubsub from '../pubsub'
import { Models } from '../models'

// args: parent, args, context, info
export default {
  Query: {
    users: async (_: any, __: any, { models }: Models) => {
      return await models.User.getUsers()
    },
  },
  Mutation: {
    createUser: async (_: any, { input: user }: any, { models }: Models) => {
      const id = await models.User.createUser(user)
      return { ...user, id }
    },
  },
  Subscription: {
    userCreated: {
      subscribe: () => pubsub.asyncIterator(['USER_CREATED']),
    },
  },
}

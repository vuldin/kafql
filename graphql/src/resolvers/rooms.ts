import pubsub from '../pubsub'
import { Models } from '../models'

// args: parent, args, context, info
export default {
  Query: {
    rooms: async (_: any, __: any, { models }: Models) => {
      return await models.Room.getRooms()
    },
  },
  Mutation: {
    createRoom: async (
      _: any,
      { input: { x, y } }: { input: { x: number; y: number } },
      { models }: Models
    ) => {
      return await models.Room.createRoom({ x, y })
    },
    updateRoom: async (_: any, { input: { x, y, ...room } }: any, { models }: Models) => {
      return await models.Room.updateRoom({ location: { x, y }, ...room })
    },
  },
  Subscription: {
    roomCreated: {
      subscribe: () => pubsub.asyncIterator(['ROOM_CREATED']),
    },
    roomUpdated: {
      subscribe: () => pubsub.asyncIterator(['ROOM_UPDATED']),
    },
  },
}

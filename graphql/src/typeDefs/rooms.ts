const { gql } = require('apollo-server-express')

export default gql`
  type RoomLocation {
    x: Int
    y: Int
  }
  type Room {
    location: RoomLocation
    acOn: Boolean
    temperature: Int
    lightsOn: Boolean
    hasWindows: Boolean
    windowsOpen: Boolean
  }
  input RoomLocationInput {
    x: Int
    y: Int
  }
  input RoomInput {
    x: Int
    y: Int
    acOn: Boolean
    temperature: Int
    lightsOn: Boolean
    hasWindows: Boolean
    windowsOpen: Boolean
  }
  extend type Query {
    rooms: [Room]
  }
  extend type Mutation {
    createRoom(input: RoomLocationInput!): Room
    updateRoom(input: RoomInput!): Room
  }
  extend type Subscription {
    roomCreated: Room
    roomUpdated: Room
  }
`

const { gql } = require('graphql-tag')

export default gql`
  type User {
    id: Int
    firstname: String
    lastname: String
    age: Int
    address: String
  }
  input UserInput {
    firstname: String
    lastname: String
    age: Int
    address: String
  }
  extend type Query {
    users: [User]
  }
  extend type Mutation {
    createUser(input: UserInput!): User
  }
  extend type Subscription {
    userCreated: User
  }
`

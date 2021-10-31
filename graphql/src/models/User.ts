import pubsub from '../pubsub'

interface User {
  firstname: string
  lastname: string
  age: number
  address?: string
}

let id = -1
let users = new Map<Number, User>()

const createUser = async (user: User) => {
  id += 1
  users.set(id, user)
  pubsub.publish('USER_CREATED', { userCreated: { ...user, id } })
  return id
}

const getUsers = async () => {
  let result = []
  for (const [id, user] of users.entries()) {
    result.push({ ...user, id })
  }
  return result
}

export default { createUser, getUsers }

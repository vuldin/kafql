import Room from './Room'
import User from './User'

export interface Models {
  models: {
    User: typeof User
    Room: typeof Room
  }
}
export default { Room, User }

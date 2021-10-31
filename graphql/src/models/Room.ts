import pubsub from '../pubsub'

interface Room {
  location: {
    x: number
    y: number
  }
  acOn: boolean
  temperature: number
  lightsOn: boolean
  hasWindows: boolean
  windowsOpen: boolean
}

let rooms = new Map<String, Room>()

const createRoom = async ({ x, y }: { x: number; y: number }) => {
  const room = {
    location: { x, y },
    acOn: false,
    temperature: 70,
    lightsOn: false,
    hasWindows: true,
    windowsOpen: false,
  }
  rooms.set(`${x}/${y}`, room)
  pubsub.publish('ROOM_CREATED', { roomCreated: room })
  return room
}

const getRooms = async () => {
  let result = []
  for (const room of rooms.values()) {
    result.push(room)
  }
  return result
}

const updateRoom = async (room: Room) => {
  rooms.set(`${room.location.x}/${room.location.y}`, room)
  pubsub.publish('ROOM_UPDATED', { roomUpdated: room })
  return room
}

export default { createRoom, getRooms, updateRoom }

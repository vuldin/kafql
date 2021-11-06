### run locally

1. git clone ...
2. npm i
3. npm run start:ts

### run docker image

1. docker build -t $DOCKER_USERNAME/graphql-streamer
2. docker run -d -p 4000:4000 vuldin/graphql-streamer
3. docker ps
4. docker stop 94eab8

### Operations

```
query {
  users {
    id
    firstname
    lastname
    age
    address
  }
}

mutation {
  createUser(input: {
    firstname: "Josh",
    lastname: "Purcell",
    age: 43,
    address: "Rolling Meadows",
  }) {
    id
    firstname
    lastname
    age
    address
  }
}

subscription {
  userCreated {
    id
    firstname
    lastname
    age
    address
  }
}

query {
  rooms {
    location {
      x
      y
    }
    acOn
    temperature
    lightsOn
    hasWindows
    windowsOpen
  }
}

mutation {
  createRoom(input: {
    x: 0,
    y: 0
  }) {
    location {
      x
      y
    }
    acOn
    temperature
    lightsOn
    hasWindows
    windowsOpen
  }
}

subscription {
  roomCreated {
    location {
      x
      y
    }
    acOn
    temperature
    lightsOn
    hasWindows
    windowsOpen
  }
}

mutation {
  updateRoom(input: {
    x: 0,
    y: 0,
    acOn: true,
    temperature: 71,
    lightsOn: false,
    hasWindows: true,
    windowsOpen: false,
  }) {
    acOn
  }
}

subscription {
  roomUpdated {
    location {
      x
      y
    }
    acOn
    temperature
    lightsOn
    hasWindows
    windowsOpen
  }
}
```

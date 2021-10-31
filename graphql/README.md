### run locally

1. git clone ...
2. npm i
3. npm run start:ts

### run docker image

1. docker build -t $DOCKER_USERNAME/graphql-streamer
2. docker run -d -p 4000:4000 vuldin/graphql-streamer
3. docker ps
4. docker stop 94eab8

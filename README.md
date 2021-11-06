# kafql

_WORK IN PROGRESS_

This project starts a [Kubernetes](https://kubernetes.io) cluster with:

- a multi-replica [Kafka](https://kafka.apache.org) stateful set in kraft mode
- a people app simulating people needing elevators rides on various floors within a building
- a building app handling up/down elevator buttons being pressed
- an [Apollo](https://apollographql.com) graphql server with subscriptions to kafka topics
- a [NextJS](https://nextjs.org) dashboard that visualizes the real-time events
- all resources running in a [Minikube](https://minikube.sigs.k8s.io/docs) kubernetes cluster

### Steps to start the cluster

1. `export DOCKER_USERNAME=<your docker username>`
1. `minikube start`
1. `docker build -t $DOCKER_USERNAME/kafql-kafka kafka`
1. `docker build -t $DOCKER_USERNAME/kafql-graphql graphql`
1. `docker build -t $DOCKER_USERNAME/kafql-building building`
1. `docker build -t $DOCKER_USERNAME/kafql-people people`
1. `docker build -t $DOCKER_USERNAME/kafql-dashboard dashboard`
1. `docker push $DOCKER_USERNAME/kafql-kafka`
1. `docker push $DOCKER_USERNAME/kafql-graphql`
1. `docker push $DOCKER_USERNAME/kafql-building`
1. `docker push $DOCKER_USERNAME/kafql-people`
1. `docker push $DOCKER_USERNAME/kafql-dashboard`
1. `sed -e "s|docker_username|$DOCKER_USERNAME|g" kafql.yml | kubectl apply -f -`
1. `kubectl config set-context --current --namespace=kafql`

## Cleanup

If you just want to stop the pods, scale down the replicas:

```
TODO scale down producer/dashboard/graphql
kubectl scale statefulsets kafka --replicas=0
```

Note that scaling down a StatefulSet can only occur when all associated replicas are running and ready. See [this section](https://kubernetes.io/docs/tasks/run-application/scale-stateful-set/#scaling-down-does-not-work-right) of the Kubernetes docs for more details.

Scale the replicas back up once you are ready to start again:

```
kubectl scale statefulsets kafka --replicas=3
TODO scale up /dashboard/graphql/people/building/elevator
```

Here are the steps to delete all components in the cluster and in your local Docker install:

```
docker rmi $DOCKER_USERNAME/kafql-kafka
docker rmi $DOCKER_USERNAME/kafql-graphql
docker rmi $DOCKER_USERNAME/kafql-building
docker rmi $DOCKER_USERNAME/kafql-people
docker rmi $DOCKER_USERNAME/kafql-dashboard
kubectl delete -f kubernetes/kafql.yml
```

Remove the elevator image if you created it:

```
docker rmi $DOCKER_USERNAME/kafql-elevator
```

_Keep in mind that the Docker images will still be available in your remote Docker Hub repo._

Use the following commands to delete the shared storage on the Minikube node:

```
minikube ssh
sudo rm -rf /mnt/data
```

### Create your own simulator app

This system is powered by simulators that listen to graphQL subscriptions and publish graphql mutations.
GraphQL operations are connected to kafka topics.
There are two required simulators: [people](./people) and [building](./building) (both are included).
A third elevator simulator will be created by you, and this can be done in any language you like.
The only requirements are that your simulator:

- is containerized and included in [the kubernetes configuration file](./kafql.yml) (so that it runs in the cluster)
- subscribes to the appropriate graphQL subscriptions. The app will receive events regarding elevator requests on specific floors, etc.
- sends graphQL mutations to move the elevator(s) up/down

Below are commands to create a typescript-based node app that can be used as the basis for a new elevator simulator:

```
mkdir elevator && cd elevator
npm init -y
npm i ts-node typescript apollo-boost graphql-tag graphql
npx tsc --init
```

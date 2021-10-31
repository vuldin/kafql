# kafql

_WORK IN PROGRESS_

This project starts a [Kubernetes](https://kubernetes.io) cluster with:

- a multi-replica [Kafka](https://kafka.apache.org) stateful set in kraft mode
- a kafka producer that creates events for people moving through various rooms in a building
- an [Apollo](https://apollographql.com) graphql server with subscriptions to kafka topics
- a [NextJS](https://nextjs.org) dashboard that visualizes the real-time events
- all resources running in a [Minikube](https://minikube.sigs.k8s.io/docs) kubernetes cluster

### Steps to start the cluster

1. `export DOCKER_USERNAME=<your docker username>`
1. `minikube start`
1. `docker build -t $DOCKER_USERNAME/kafql-kafka kafka`
1. `docker build -t $DOCKER_USERNAME/kafql-graphql graphql`
1. `docker build -t $DOCKER_USERNAME/kafql-producer producer`
1. `docker build -t $DOCKER_USERNAME/kafql-dashboard dashboard`
1. `docker push $DOCKER_USERNAME/kafql-kafka`
1. `docker push $DOCKER_USERNAME/kafql-graphql`
1. `docker push $DOCKER_USERNAME/kafql-producer`
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
TODO scale up producer/dashboard/graphql
```

Here are the steps to delete all components in the cluster and in your local Docker install:

```
docker rmi $DOCKER_USERNAME/kafql-kafka
docker rmi $DOCKER_USERNAME/kafql-graphql
docker rmi $DOCKER_USERNAME/kafql-producer
docker rmi $DOCKER_USERNAME/kafql-dashboard
kubectl delete -f kubernetes/kafql.yml
```

_Keep in mind that you will still have the Docker image available in your remote Docker Hub repo._

Use the following commands to delete the shared storage on the Minikube node:

```
minikube ssh
sudo rm -rf /mnt/data
```


[//]: # ( Copyright 2017 Turbine Labs, Inc.                                   )
[//]: # ( you may not use this file except in compliance with the License.    )
[//]: # ( You may obtain a copy of the License at                             )
[//]: # (                                                                     )
[//]: # (     http://www.apache.org/licenses/LICENSE-2.0                      )
[//]: # (                                                                     )
[//]: # ( Unless required by applicable law or agreed to in writing, software )
[//]: # ( distributed under the License is distributed on an "AS IS" BASIS,   )
[//]: # ( WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or     )
[//]: # ( implied. See the License for the specific language governing        )
[//]: # ( permissions and limitations under the License.                      )

[//]: # (Integrating Houston with Kubernetes)

## Prerequisites

### A Turbine Labs API key
Make sure you have a valid Turbine Labs API key. If you don't email
support@turbinelabs.io to get set up. This tutorial assumes you've set
an environment variable named $TBN_API_KEY to the value of your API
key, e.g. (in bash)

`export TBN_API_KEY=ed6b67e9-31d4-4413-5a8d-23c863405ecf`

### A functional kubernetes cluster
If you don't have one, the
[GKE quick start guide](https://cloud.google.com/container-engine/docs/quickstart) is
a great resource to get one set up quickly.

### The tbnctl CLI

tbnctl is a CLI for interacting with the Turbine Labs public API, and
is used throughout this guide to set up tbnproxy. Install tbnctl with
these commands (Requires installation of Go):

```shell
go get -u github.com/turbinelabs/tbnctl
go install github.com/turbinelabs/tbnctl
```

## Creating a Zone

The highest level unit of organization in the Turbine Labs API is a
zone. We'll use the zone "testbed" in the examples, but you can
substitute your own if you already have one created. To create the
testbed zone you can run 

```shell
tbnctl init-zone testbed
```

You should now be able to see your zone by running

```shell
tbnctl list zone
```

## Adding your API key to kubernetes

To avoid having your API key visible in environment variables (which
area easy to inadvertently expose in logs and the command line) we
recommend you store it as a kubernetes secret. Executing the following
command will create a new secret with your API key, that we can
reference from other deployment specs.

```shell
kubectl create secret generic tbnsecret --from-literal=apikey=$TBN_API_KEY
```

## Setting up Service Discovery

Tbncollect is a container that scans your kubernetes clusters for
pods and groups them into clusters in the Turbine Labs API. To deploy
tbncollect to kubernetes run

```shell
kubectl create -f tbncollect-spec.yaml
```

where tbncollect-spec.yaml contains

```yaml
apiVersion: extensions/v1beta1
kind: Deployment
metadata:
  annotations:
    deployment.Kubernetes.io/revision: "2"
  generation: 4
  labels:
    run: tbncollect
  name: tbncollect
  namespace: default
  resourceVersion: "427"
spec:
  replicas: 1
  selector:
    matchLabels:
      run: tbncollect
  strategy:
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 1
    type: RollingUpdate
  template:
    metadata:
      creationTimestamp: null
      labels:
        run: tbncollect
    spec:
      containers:
      - image: turbinelabs/tbncollect:latest
        imagePullPolicy: IfNotPresent
        name: tbncollect
        env:
        - name: TBNCOLLECT_COMMAND
          value: kubernetes
        - name: TBNCOLLECT_API_ZONE_NAME
          value: testbed
        - name: TBNCOLLECT_API_KEY
          valueFrom:
            secretKeyRef:
              name: tbn_secret
              key: api_key
        resources: {}
```

## The all-in-one demo

We'll use the same client application described in
our
[quickstart](https://docs.turbinelabs.io/docs/versions/1.0/quick-start) for
these examples. To deploy the all-in-one client, run

```shell
kubectl create -f all-in-one-client.yaml
```

where the contents of all-in-one-client.yaml are

```yaml
apiVersion: extensions/v1beta1
kind: Deployment
metadata:
  annotations:
    deployment.Kubernetes.io/revision: "2"
  generation: 4
  labels:
    run: all-in-one-client
  name: all-in-one-client
  namespace: default
  resourceVersion: "427"
spec:
  replicas: 1
  selector:
    matchLabels:
      run: all-in-one-client
  strategy:
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 1
    type: RollingUpdate
  template:
    metadata:
      creationTimestamp: null
      labels:
        run: all-in-one-client
        tbn_cluster: all-in-one-client
        app: all-in-one-client

    spec:
      containers:
      - image: turbinelabs/all-in-one-client:latest
        imagePullPolicy: IfNotPresent
        name: all-in-one-client
        ports:
        - containerPort: 8080
          name: http
          protocol: TCP
        resources: {}
```

Next, deploy the all-in-one server by running

```shell
kubectl -f all-in-one-server.yaml
```

Where all-in-one-server.yaml is

```yaml
apiVersion: extensions/v1beta1
kind: Deployment
metadata:
  annotations:
    deployment.Kubernetes.io/revision: "2"
  generation: 4
  labels:
    run: all-in-one-server
  name: all-in-one-server
  namespace: default
  resourceVersion: "427"
spec:
  replicas: 1
  selector:
    matchLabels:
      run: all-in-one-server
  strategy:
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 1
    type: RollingUpdate
  template:
    metadata:
      creationTimestamp: null
      labels:
        run: all-in-one-server
        tbn_cluster: all-in-one-server
        stage: prod
        app: all-in-one-server

    spec:
      containers:
      - image: turbinelabs/all-in-one-server:latest
        imagePullPolicy: IfNotPresent
        name: all-in-one-server
        env:
        - name: TBN_COLOR
          value: 1B9AE4
        ports:
        - containerPort: 8080
          name: http
          protocol: TCP
        resources: {}
```

Now we'll deploy a new version of the server that returns green as the
color to paint blocks.

```shell
kubectl -f all-in-one-server.yaml
```

Where all-in-one-server.yaml is

```yaml
apiVersion: extensions/v1beta1
kind: Deployment
metadata:
  annotations:
    deployment.Kubernetes.io/revision: "2"
  generation: 4
  labels:
    run: all-in-one-server
  name: all-in-one-server
  namespace: default
  resourceVersion: "427"
spec:
  replicas: 1
  selector:
    matchLabels:
      run: all-in-one-server
  strategy:
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 1
    type: RollingUpdate
  template:
    metadata:
      creationTimestamp: null
      labels:
        run: all-in-one-server
        tbn_cluster: all-in-one-server
        stage: prod
        app: all-in-one-server

    spec:
      containers:
      - image: turbinelabs/all-in-one-server:latest
        imagePullPolicy: IfNotPresent
        name: all-in-one-server
        env:
        - name: TBN_COLOR
          value: 83D061
        ports:
        - containerPort: 8080
          name: http
          protocol: TCP
        resources: {}
```

Ensure that these pods have started correctly by running

```shell
kubectl get pods
```

And then verify tbncollect has discovered them and added them to
appropriate clusters by running

```shell
tbnctl list cluster
```

You should see an all-in-one-client and all-in-one-server cluster,
each with a single node

## Adding a domain and proxy

Tbnproxy is the container that handles request routing. It serves
traffic for a set of domains, which in turn contain release groups and
routes. We'll create the domain first

```shell
echo '{"name": "testbed-domain", "zone_key": "<your zone key>", "port": 80}' | tbnctl create domain
```

And then add the proxy, substituting the domain key from the create
domain command.

```shell
echo '{"name": "testbed-proxy", "zone_key": "<your zone key>", "domain_keys": ["<domain_key>"]}' | tbnctl create proxy
```

Now we're ready to deploy tbnproxy to kubernetes.

```shell
kubectl create -f tbnproxy-spec.yaml
```

where tbnproxy-spec.yaml contains

```yaml
apiVersion: extensions/v1beta1
kind: Deployment
metadata:
  annotations:
    deployment.Kubernetes.io/revision: "2"
  generation: 4
  labels:
    run: tbnproxy
  name: tbnproxy
  namespace: default
  resourceVersion: "427"
spec:
  replicas: 1
  selector:
    matchLabels:
      run: tbnproxy
  strategy:
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 1
    type: RollingUpdate
  template:
    metadata:
      creationTimestamp: null
      labels:
        run: tbnproxy
    spec:
      containers:
      - image: turbinelabs/tbnproxy:latest
        imagePullPolicy: Always
        name: tbnproxy
        env:
        - name: TBNPROXY_PROXY_NAME
          value: testbed-proxy
        - name: TBNPROXY_API_ZONE_NAME
          value: testbed
        - name: TBNPROXY_API_KEY
          valueFrom:
            secretKeyRef:
              name: tbnsecret
              key: apikey
        ports:
        - containerPort: 80
          protocol: TCP
        resources: {}
```

## Expose tbnproxy to the external network

This is environment specific. If you're running in GKE you can use the
following path. First, expose the deployment on a NodePort to make it
accessible outside the local kubernetes network

```shell
kubectl expose deployment tbnproxy --target-port=80 --type=LoadBalancer
```

Then wait for an external IP address to be created (this may take some time)

```shell
kubectl get services --watch
```

```shell
NAME           CLUSTER-IP     EXTERNAL-IP       PORT(S)   AGE
Kubernetes     10.3.240.1     <none>            443/TCP   24m
tbnproxy   10.3.241.247   104.198.110.237   80/TCP    5m
```
## Configure routes

Now we have a proxy running and exposed to the internet, along with
clusters and instances configured in the Turbine Labs service. Next we
map requests to clusters. Log in to https://app.turbinelabs.io with
your email address and API key.

First we'll create a route to send traffic to the all-in-one
client.

1. Make sure you have the appropriate zone selected in the top left
portion of the screen.
2. Click settings in  the top right portion of the screen, and then
click edit routes.
3. Click more, then create route.
4. Select your domain in the domain drop down
5. Enter "/" in the path field
5. Click the release group dropdown and select "create new release
   group"
6. Select "all-in-one-client" from the service drop down
7. Enter "client" in the release group name field
8. Click "create route and release group"

Now we'll repeat these steps to create a route to send anything going
to /api to the all-in-one server

1. Click settings in  the top right portion of the screen, and then
click edit routes.
2. Click more, then create route.
3. Select your domain in the domain drop down
4. Enter "/api" in the path field
4. Click the release group dropdown and select "create new release
   group"
5. Select "all-in-one-server" from the service drop down
6. Enter "server" in the release group name field
7. Click "create route and release group"

## Verifying your deploy

Now visit your load balancer, and you should see the all-in-one client
running. To get the IP address for your deployment you can run 


```shell
kubectl get service
```

copy the EXTERNAL-IP field for the tbnproxy service, and paste that
into the address bar of your browser.

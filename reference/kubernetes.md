
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

[//]: # (Deploying the Turbine Labs Product Suite to Kubernetes)

## Prerequisites

### Follow the [Configuration guide](https://docs.turbinelabs.io/docs/versions/1.0/configuration) guide
This will ensure your API key, domain, zone, routes, and other key components
are set up correctly.

### Follow the [GKE Quick Start guide](https://cloud.google.com/container-engine/docs/quickstart)
Google's GKE Quick Start guide will walk you through setting up Google
Container Engine, as well as a simple Node app, which we'll modify below.

### Service Discovery with tbncollect
tbncollect can filter applications based on labels as well as port names.

- By default the label selector is set to all labels, and the port name filter
is set to “http”.
  - This means you will need to name ports in your environment if you want them
  exposed via tbnproxy, or configure tbncollect (usually via environment
  variables) to use a different set of filters.

## Updating the Demo App
First, you need to update our demo app to be discoverable by tbncollect. Next,
you’ll need to add a label to pods and name the exposed port 80. The following
labels are what the agent process will look for:

- run
- name
- tbn_cluster
- app

Run this command to edit the labels:

```shell
kubectl edit deployment hello-node
```

and add the following lines:

```yaml
# Please edit the object below. Lines beginning with a '#' will be ignored,
# and an empty file will abort the edit. If an error occurs while saving this
# file will be reopened with the relevant failures.
#
apiVersion: extensions/v1beta1
kind: Deployment
metadata:
  annotations:
    deployment.Kubernetes.io/revision: "2"
  creationTimestamp: 2016-09-07T23:27:25Z
  generation: 4
  labels:
  run: hello-node
  name: hello-node
  namespace: default
  resourceVersion: "427"
  selfLink: /apis/extensions/v1beta1/namespaces/default/deployments/hello-node
  uid: a2421d42-7552-11e6-8bf4-42010a8a00ae
spec:
  replicas: 1
  selector:
    matchLabels:
      run: hello-node
  strategy:
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 1
    type: RollingUpdate
  template:
    metadata:
      creationTimestamp: null
      labels:
        run: hello-node
        tbn_cluster: hello-node
        app: hello-node

    spec:
      containers:
      - image: gcr.io/testbed-141620/hello-node:v1
        imagePullPolicy: IfNotPresent
        name: hello-node
        ports:
        - containerPort: 8080
          name: http
          protocol: TCP
        resources: {}
```

Kubernetes will automatically terminate the old instance and start a new,
discoverable copy.

## Deploying tbnproxy
Next, you deploy tbnproxy with this command:

```shell
kubectl run tbnproxy --image=gcr.io/$PROJECT_ID/tbnproxy:latest --port=80 --env="TBNPROXY_API_KEY=$TBN_API_KEY" --env="TBNPROXY_API_ZONE_NAME=testbed" --env="TBNPROXY_PROXY_NAME=tbnproxy-1"
```

### Deploying tbncollect
Use the following to deploy tbncollect:

```shell
kubectl run tbncollect --image=gcr.io/$PROJECT_ID/tbncollect:v1 --env=”TBNCOLLECT_CMD=Kubernetes” --env=”TBNCOLLECT_API_KEY=$TBN_API_KEY” --env=”TBNCOLLECT_API_ZONE_NAME=testbed”
```

### Verifying the Demo Instances
Once these pods are running, you should be able to see instances show up in the
Turbine Labs Service:

```shell
curl -s -H "X-Turbine-API-Key: $TBN_API_KEY" https://api.turbinelabs.io/v1.0/cluster/<your cluster key>
```

*Example Response*:

```javascript
{
   "result" : {
      "checksum" : "<your checksum value>",
      "name" : "hello-node",
      "instances" : [
         {
            "metadata" : [
               {
                  "key" : "pod-template-hash",
                  "value" : "3891907727"
               },
               {
                  "key" : "run",
                  "value" : "hello-node"
               }
            ],
            "host" : "10.0.0.4",
            "port" : 8080
         }
      ],
      "cluster_key" : "<your cluster key>",
      "zone_key" : "<your zone key>"
   }
}
```

You should also be able to see your instances mapped to the nginx config
running in tbnproxy

```shell
kubectl get pods
```

```
NAME                             READY     STATUS    RESTARTS   AGE
hello-node-3891907727-oxy9c      1/1       Running   0          10m
tbnproxy-741222945-xzpdt     1/1       Running   0          7m
tbncollect-3747088091-thd4q   1/1       Running   0          6m
```

```shell
kubectl exec tbnproxy-741222945-xzpdt cat /etc/nginx/nginx.conf | grep -A 6 "upstream hello-node"
```

```yaml
  upstream hello-node {
    tbn_balancer {
      tbn_server 10.0.0.4:8080 {
        metadatum pod-template-hash 3891907727;
        metadatum run hello-node;
      }
    }
--
          upstream hello-node {
            weight 100;
            constraint app hello-node;
          }
        }
      }
    }
```

## Exposing tbnproxy to the internet

### GKE
To expose tbnproxy to the internet you create a LoadBalancer for the service

```shell
kubectl expose deployment tbnproxy --type="LoadBalancer"
```

Then wait for an external IP address to be created (this may take some time)

```shell
kubectl get services
```

```
NAME           CLUSTER-IP     EXTERNAL-IP       PORT(S)   AGE
Kubernetes     10.3.240.1     <none>            443/TCP   24m
tbnproxy   10.3.241.247   104.198.110.237   80/TCP    5m
```

```shell
curl 104.198.110.237
```

```
Hello World!
```

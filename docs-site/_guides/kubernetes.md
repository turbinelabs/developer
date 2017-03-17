---
layout: page
title: Kubernetes Guide
---

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
Make sure you have a valid Turbine Labs API key. If you don't, email
support@turbinelabs.io to get set up. This tutorial assumes you've set an
environment variable named $TBNCTL_API_KEY to the value of your API key, e.g.,
(in bash)

`export TBNCTL_API_KEY=ed6b67e9-31d4-4413-5a8d-23c863405ecf`

### A functional Kubernetes cluster

If you don't have one, the [GKE quick start
guide](https://cloud.google.com/container-engine/docs/quickstart) is a great
resource to get one set up quickly.

### The tbnctl command line interface (CLI)

tbnctl is a CLI for interacting with the Turbine Labs public API, and is used
throughout this guide to set up tbnproxy. Install tbnctl with these commands
(Requires [installation of Go](https://golang.org/dl/), and that `$GOPATH/bin`
is in your `$PATH`):

```shell
go get -u github.com/turbinelabs/tbnctl
go install github.com/turbinelabs/tbnctl
```

## Creating a Zone

The highest-level unit of organization in the Turbine Labs API is a zone. We'll
use the zone "testbed" in this guide, but you can substitute your own if you've
already created one. To create the testbed zone, run

```shell
tbnctl init-zone testbed
```

You should now be able to see your zone by running

```shell
tbnctl list zone
```

## Adding your API key to Kubernetes

To avoid having your API key visible in environment variables (which can
inadvertently be exposed in logs and the command line) we recommend you store it
as a [Kubernetes secret](https://kubernetes.io/docs/user-guide/secrets/).
Running the following command will create a new secret with your API key that we
can reference from other deployment specs.

```shell
kubectl create secret generic tbnsecret --from-literal=apikey=$TBNCTL_API_KEY
```

## Setting up Service Discovery

Tbncollect is a container that scans your Kubernetes cluster for pods and groups
them into clusters in the Turbine Labs API. To deploy tbncollect to your
Kubernetes cluster, run

```shell
kubectl create -f https://raw.githubusercontent.com/turbinelabs/developer/master/docs-site/examples/kubernetes/tbncollect-spec.yaml
```

## The all-in-one demo

We'll use the same client application described in
our
[quickstart]({{ "/reference/#quick-start" | relative_url }}) for
these examples. To deploy the all-in-one client, run

```shell
kubectl create -f https://raw.githubusercontent.com/turbinelabs/developer/master/docs-site/examples/kubernetes/all-in-one-client.yaml
```

Next, deploy the all-in-one server by running

```shell
kubectl create -f https://raw.githubusercontent.com/turbinelabs/developer/master/docs-site/examples/kubernetes/all-in-one-server-blue.yaml
```

Now we'll deploy a new version of the server that returns green as the color to
paint blocks.

```shell
kubectl create -f https://raw.githubusercontent.com/turbinelabs/developer/master/docs-site/examples/kubernetes/all-in-one-server-green.yaml
```

Ensure that these pods have started correctly by running

```shell
kubectl get pods
```

You should see output similar to the following

```shell
NAME                                       READY     STATUS    RESTARTS   AGE
all-in-one-client-680519093-jdx7g          1/1       Running   0          2m
all-in-one-server-1015810482-rgf8f         1/1       Running   0          1m
all-in-one-server-green-3537570873-7npmx   1/1       Running   0          22s
tbncollect-3235735371-f594t                1/1       Running   0          3m
```

Now verify that tbncollect has discovered your new pods and added them to the
appropriate clusters by running

```shell
tbnctl list --format=summary cluster
```

You should see a `name: all-in-one-client` cluster with a single instance and a
`name: all-in-one-server` cluster with two instances, one with `version: green`
and one with `version: blue`.

## Adding a domain and proxy

Tbnproxy is the container that handles request routing. It serves traffic for a
set of domains, which in turn contain release groups and routes. We'll create
the domain first

```shell
echo '{"name": "testbed-domain", "zone_key": "<your zone key>", "port": 80}' | tbnctl create domain
```

> Remember that you can get your zone's key by running `tbnctl list zone`

And then add the proxy, substituting the domain key from the create domain
command.

```shell
echo '{"name": "testbed-proxy", "zone_key": "<your zone key>", "domain_keys": ["<domain_key>"]}' | tbnctl create proxy
```

Now we're ready to deploy tbnproxy to Kubernetes.

```shell
kubectl create -f https://raw.githubusercontent.com/turbinelabs/developer/master/docs-site/examples/kubernetes/tbnproxy-spec.yaml
```

## Expose tbnproxy to the external network

This is environment specific. If you're running in GKE you can use the following
path. First, expose the deployment on a NodePort to make it accessible outside
the local Kubernetes network

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

Now we have a proxy running and exposed to the Internet, along with clusters and
instances configured in the Turbine Labs service. Next we map requests to
clusters. Log in to https://app.turbinelabs.io with your email address and API
key.

First we'll create a route to send traffic to the all-in-one client.

1. Make sure you have the 'testbed' zone selected in the top left portion of the
screen.
2. Click the "Settings" menu in the top right portion of the screen, and then
select "Edit Routes".
3. Click the "More" menu, then select "Create Route".
4. Select your domain in the domain drop down
5. Enter "/" in the path field
6. Click the release group dropdown and select "Create New Release Group..."
7. Select "all-in-one-client" from the service drop down
8. Enter "client" in the release group name field
9. Click the "Create Route + Release Group" button

Now we'll repeat these steps to create a route to send anything going to /api to
the all-in-one server

1. Click the "Settings" menu in the top right portion of the screen, and then
select "Edit Routes".
2. Click the "More" menu, then select "Create Route".
3. Select your domain in the domain drop down
4. Enter "/api" in the path field
5. Click the release group dropdown and select "Create New Release Group..."
6. Select "all-in-one-server" from the service drop down
7. Enter "server" in the release group name field
8. Click the "Create Route + Release Group" button

## Verifying your deploy

Now visit your load balancer, and you should see the all-in-one client running.
To get the IP address for your deployment you can run


```shell
kubectl get service
```

copy the EXTERNAL-IP field for the tbnproxy service, and paste that into the
address bar of your browser.

Now that you're up and running with Houston on Kubernetes, you should head over
to [Demo
Exercises](https://docs.turbinelabs.io/docs/versions/1.0/quick-start#demo-exercises)
to learn more about metrics, dynamic routing, and managing releases.

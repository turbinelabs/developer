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

Ensure that these pods have started correctly by running

```shell
kubectl get pods
```

You should see output similar to the following

```shell
NAME                                       READY     STATUS    RESTARTS   AGE
all-in-one-client-680519093-jdx7g          1/1       Running   0          2m
all-in-one-server-1015810482-rgf8f         1/1       Running   0          1m
tbncollect-3235735371-f594t                1/1       Running   0          3m
```

Now verify that tbncollect has discovered your new pods and added them to the
appropriate clusters by running

```shell
tbnctl list --format=summary cluster
```

You should see a `name: all-in-one-client` cluster with a single instance and a
`name: all-in-one-server` cluster with one instances and a `name:
all-in-one-client`.

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

## Demo Exercises

Now that you're up and running with Houston on Kubernetes, let's walk
through some product use cases.

### What's going on here?

The all-in-one client provides
a UI and a set of services that help visualize changes in the mapping of user
requests to backend services. This lets you visualize the impact of
Houston on a real deployment without having to involve real customer
traffic or load generators.

The application is composed of three sets of
blocks, each simulating a user making a request. These are simple users, and
they all repeat the same request forever. The services they call return a color.
When a user receives a response it paints the box that color, then waits a
random amount of time to make another request. While it’s waiting the colors in
the box fade. Users are organized into rows based on URL.

<img height="50%" width="50%" src="https://d16co4vs2i1241.cloudfront.net/uploads/tutorial_image/file/684824296811398630/85fd3f987358bbbf866ace1ac6193f07fb5788a4302291a8e29c3eef7ac8c973/column_sized_Screen_Shot_2017-01-26_at_9.40.43_PM.png"/>

You should see pulsating blue boxes for each service, to indicate the initial
state of your production services.

### Deployed state

Let’s dig deeper into how tbnproxy routes traffic. Traffic is received by a
proxy that handles traffic for a given domain. The proxy maps requests to
service instances via routes and rules. Routes let you split your domain into
manageable segments, for example `/bar` and `/baz`. Rules let you map requests
to a constrained set of service instances in clusters, for example “by default
send traffic to servers tagged with a key-value mapping of stage=production”.
Clusters contain sets of service instances, each of which can be tagged with
key/value pairs to provide more information to the routing engine.

Your environment should look like the following

<img src="https://img.turbinelabs.io/2017-03-17/prismatic-setup-kube-1.png"/>

There is a single domain (`testbed-domain:80`) that contains two routes. `/api`
handles requests to our demo service instances, and `/` handles
requests for everything else (in this case the all-in-one app). There are
two clusters. All-in-one-server cluster has 1 instance, tagged with a
 version "blue" and a stage "prod". The all-in-one-client cluster has a single instance
tagged prod.

### Set up an initial route

The rules currently map api traffic to all instances in the cluster.
which is why an even split of green and blue boxes is showing. To
enable the release workflow we need to constrain routing to a single
version at a single stage, so let's configure Houston to route traffic
to the blue version.

1. Make sure you have the 'testbed' zone selected in the top left portion of the
screen.
2. Click the "Settings" menu in the top right portion of the screen, and then
select "Edit Routes".
3. Click the "select view" menu in the top left portion of the screen,
   and select the api route.
4. Change `1 to 'all-in-one-server'` to `1 to 'all-in-one-server
   stage = prod & version = blue`
5. Click "Save Release Group"

If you look at the all-in-one client you should see all blue blocks,
because we've constrained the routing to only go to servers in the
cluster tagged with a version of "blue".

### Deploying a new version

Now we'll deploy a new version of the server that returns green as the color to
paint blocks.

```shell
kubectl create -f https://raw.githubusercontent.com/turbinelabs/developer/master/docs-site/examples/kubernetes/all-in-one-server-green.yaml
```

if you run 

```shell
kubectl get pods
```

you should see a new server pod running the green version

```shell
NAME                                       READY     STATUS    RESTARTS   AGE
all-in-one-client-680519093-jdx7g          1/1       Running   0          2m
all-in-one-server-1015810482-rgf8f         1/1       Running   0          1m
all-in-one-server-green-3537570873-7npmx   1/1       Running   0          22s
tbncollect-3235735371-f594t                1/1       Running   0          3m
```

Your environment now looks like the following

<img
src="https://img.turbinelabs.io/2017-03-17/prismatic-setup-kube-2.png"/>

The a new instance has been added to the all-in-one-server cluster,
but no traffic is routed to it. Going to your client app you should
still see only blue blocks, because we set our routing constraints in
the previous step. Your environment now looks like the following

### Testing before release

Let’s test our green version before we release it to customers. tbnproxy
allows you to route to service instances based on headers set in the request.
Navigate to [app.turbinelabs.io](https://app.turbinelabs.io), log in and select
the zone you’re working with (testbed by default). Click settings -> edit
routes, and select testbed-domain:80/api from the top left dropdown. You should see
the following screen

Click “Add Rule” from the top right, and enter the following values.

<img
src="https://img.turbinelabs.io/2017-03-17/all-in-one-server-header-rule.png"/>

This tells the proxy to look for a header called `X-TBN-Version`. If
the proxy finds that header, it uses the value to find servers in the
all-in-one-client cluster that have a matching version tag. For
example, setting `X-TBN-Version: blue` on a request would match blue
production servers, and `X-TBN-Version: green` would match yellow dev
servers.

The demo app converts a `X-TBN-Version` query parameter into a header
in calls to the backend; if you navigate to
`http://<your-client>?X-TBN-Version=green`
you should see all green boxes. Meanwhile going to
`http://<your-client>` without that parameter still shows blue.

This technique is extremely powerful. New software was previewed in
production without customers being affected. You were able to test the new
software on the live site before releasing to customers. In a real world
scenario your testers can perform validation, you can load test, and you can
demo to stakeholders without running through a complicated multi-environment
scenario, even during another release.

### Incremental release

Navigate to [app.turbinelabs.io](https://app.turbinelabs.io), then click
"Release Groups" below the top-line charts. The row "server"
should be marked "RELEASE READY". Click anywhere in the row to expand it, then
click "start release".

<img src="https://d16co4vs2i1241.cloudfront.net/uploads/tutorial_image/file/684826314011575784/885556999d2fcb7e44ea4ecd2210f8e0f57227d0683b581d15f5103195e9d91e/column_sized_Screen_Shot_2017-01-26_at_9.44.35_PM.png" height="100%" width="100%"/>

Let's send 25% of traffic to our new green version by 
moving the slider and clicking "start release". The Release Group should now
be marked "RELEASING".

![Screen Shot 2017 01 26 At 9.48.28 Pm](https://d16co4vs2i1241.cloudfront.net/uploads/tutorial_image/file/684828276752909802/f33f12bdbbfc7ec76f36f51cbbfaa6ea4ed2acc8bb4a961363bdbe2003ec483c/column_sized_Screen_Shot_2017-01-26_at_9.48.28_PM.png)

The all in one client should now show a mix of blue and green. You can
increment the green percentage as you like. When you get to 100%, the release
is complete.

<img src="https://d16co4vs2i1241.cloudfront.net/uploads/tutorial_image/file/684828961254933996/b030e8b9bbcbe04c615c87a327bebe7525ec97c4b82e71be357e71efe28a9b16/column_sized_Screen_Shot_2017-01-26_at_9.49.37_PM.png" width="50%" height="50%"/>

Congratulations! You've safely and incrementally released a new version of your
production software. Both blue and green versions are still running; if a
problem were found with green, a rollback to blue would be just as easy.

### Testing latency and error rates

In order to demo what errors and latency issues may look like in a production environment, we implemented a few parameters that can be set to illustrate these scenarios. By default, each of the demo servers returns a successful (status code 200) response with its color (as a hex string) as the response body.

URL parameters passed to the client web page at can be used to control the mean latency and error rate of each of the different server colors.

*an example*
The following URL will show an error rate and delayed response for green and blue servers.

```
http://<your client>/?x-blue-delay=25&x-blue-error=.001&x-green-delay=10&x-green-error=.25
```

This will simulate a bad green release, and a need to rollback to a known good blue release.

#### Parameter effect

These parameters can be modified in the above example as follows:

- x-color-delay
  Sets the mean delay in milliseconds.
- x-color-error
  Sets the error rate, describe as a fraction of 1 (e.g., 0.5 causes an error 50% of the time).

The latency and error rates are passed to the demo servers as HTTP headers with the same name and value as the URL parameters described. This effect can help you visualize the effects of a bad release, or issue with the code in a new version of your application, which would be cause to step-down the release and return traffic to a known good version.

## Next steps

Now that you've seen demo app in action, you can move on to deploying Houston in your own environment. After reading the configuration guide below, proceed to
one of the following cloud integrations:

- [Kubernetes](../guides/kubernetes.html)
- [Marathon](../guides/marathon.html)
- [Docker on EC2](../guides/ec2-setup.html)
- [ECS](../guides/ecs-setup.html)
- [Consul](../guides/consul.html)

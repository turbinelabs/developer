---
layout: page
title: Quickstart
print_order: 4
time_to_complete: 10 minutes
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

[//]: # (Quick Start)

This guide walks you through setting up, and using an all-in-one example app, as
well as a few exercises to illustrate what Houston and the Turbine Labs API can
accomplish.

## Signing up for an account

To get started with Houston, you'll need a Turbine Labs
account. [Click here to get started.](https://turbinelabs.io/contact/)

## What's in the All-In-One image?

### tbnproxy and tbncollect

These two applications will run in a real-world deployment, connected to Turbine
Labs' API.

- **tbnproxy**: The Turbine Labs reverse proxy as well as an admin agent that
maintains proxy configuration and sends metrics to the Turbine Labs Service.
- **tbncollect**: A service discovery agent that observes the service instances,
updating the Turbine Labs Service as services or applications come and go. In
this demo, the collector is watching for files instead of API instances.

### All-in-one server

A simple HTTP server application that returns hex color value strings. There
are three "versions" of the server, each returning a different color value:

  - blue
  - green
  - yellow

### All-in-one client

This app is used to demonstrate the use of Houston through a simple
visualization of routing and responses, but is disposable after experimenting
with this demo.

## Starting the all-in-one example

The three environment variables you'll need to set in order to run the demo are:

- `TBNPROXY_API_KEY` - the Turbine Labs API key to use
- `TBNPROXY_API_ZONE_NAME` - the zone name to use for the trial
- `TBNPROXY_PROXY_NAME` - the name of the proxy, usually the zone name with a
  "-proxy" suffix

To run the Docker container with tbnproxy, tbncollect, and the all-in-one server
and client, use the following command:

```console
$ docker run -p 80:80 \
  -e "TBNPROXY_API_KEY=$TBN_API_KEY" \
  -e "TBNPROXY_API_ZONE_NAME=all-in-one-demo" \
  -e "TBNPROXY_PROXY_NAME=all-in-one-demo-proxy" \
  turbinelabs/all-in-one:0.8.1
```

This command will:

- Pull the Turbine Labs all-in-one image from Docker Hub if you don't already
have it.
- Initialize your test zone if it doesn't already exist.
- Launch tbnproxy.
- Launch tbncollect.
- Launch the client and server instances.

_Note:_ In some cases the local Docker time may have drifted significantly  from
your host's time. If this is the case, you'll see the following message in the
`docker run` output:

```
FATAL: your docker system clock differs from actual (google) time by more
than a minute. This will cause stats and charts to behave strangely.
```

If you see this error, restart Docker and re-run the all-in-one container.

{%
  include guides/demo_exercises_whats_going_on.md
  all_in_one="true"
%}

{%
  include guides/deployed_state.md
  all_in_one="true"
%}

{% include guides/incremental_release.md %}

### Browser overrides

Let’s test our yellow dev version before we release it to customers. tbnproxy
allows you to route to service instances based on headers set in the request.
Navigate to [app.turbinelabs.io](https://app.turbinelabs.io), log in and select
the zone you’re working with (all-in-one-demo by default). Click "Settings" ->
"Edit Routes", and select all-in-one-demo:80/api from the top left dropdown. You
should see the following screen

<img src="../assets/all-in-one_edit_route.png"/>

Click “Add Rule” from the top right, and enter the following values:

IF `Header: X-TBN-Version & version` Send `1 to all-in-one-server`.

<img src="../assets/all-in-one_add_rule.png"/>

This tells the proxy to look for a header called `X-TBN-Version`. If the proxy
finds that header, it uses the value to find servers in the all-in-one-server
cluster that have a matching version tag. For example, setting `X-TBN-Version:
blue` on a request would match blue production servers, and `X-TBN-Version:
yellow` would match yellow dev servers.

The all-in-one client converts a `X-TBN-Version` query parameter into a header
in calls to the backend; if you navigate to
[localhost?X-TBN-Version=yellow](http://localhost?X-TBN-Version=yellow) you
should see all yellow boxes. Meanwhile going to [localhost](http://localhost)
without that parameter still shows blue or green based on the release state of
previous steps in this guide.

<img src="https://d16co4vs2i1241.cloudfront.net/uploads/tutorial_image/file/619233248442058713/9e580867275ee1a7fd6b502c8b5c8e6fbc24ea8ec31759ac5b2326ea7fdc264c/column_sized_Screen_Shot_2016-10-28_at_10.43.02_AM.png" height="50%" width="50%"/>

This technique is extremely powerful. New software was tested in
production without customers being affected. You were able to test the new
software on the live site before releasing to customers. In a real world
scenario your testers can perform validation, you can load test, and you can
demo to stakeholders without running through a complicated multi-environment
scenario, even during another release.

{% include guides/testing_latency_and_error_rates.md %}

## Next steps

Now that you've seen all-in-one demo in action, you can move on to deploying
Houston in your own environment. After reading the configuration guide below,
proceed to one of the following cloud integrations:

- [Kubernetes](../guides/kubernetes.html)
- [Marathon](../guides/marathon.html)
- [Docker on EC2](../guides/ec2-setup.html)
- [ECS](../guides/ecs-setup.html)
- [Consul](../guides/consul.html)

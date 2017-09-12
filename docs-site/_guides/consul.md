---
layout: page
title: Consul Guide
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

[//]: # (Integrating Houston with Consul)

{%
  include guides/prerequisites.md
  platform="Consul"
  quick_start_name="Install Consul"
  quick_start_url="https://www.consul.io/intro/getting-started/install.html"
  install_extra="

In our examples below, we'll assume a Consul install on a local development
machine, listening on the machine's IP address (_not_ localhost) on port 8500,
with a datacenter named \"dc1\", but the concepts should extend to a larger
installation. We'll also assume a working docker installation. "

%}

## Setting up service discovery

First, install and run tbncollect on an instance of server of your choice,
with your environment variables defined inside of the Docker command, using
the `signed_token` you obtained with `tbnctl`:

```console
$ docker run -d \
  -e "TBNCOLLECT_API_KEY=<your signed_token>" \
  -e "TBNCOLLECT_API_ZONE_NAME=<your zone name>" \
  -e "TBNCOLLECT_CMD=consul" \
  -e "TBNCOLLECT_CONSUL_DC=dc1" \
  -e "TBNCOLLECT_CONSUL_HOSTPORT=<your ip address>:8500" \
  turbinelabs/tbncollect:0.12.0
```

Use `tbncollect help consul` to determine which environmental variables you
can use and modify.

## The all-in-one demo

We'll use the same client application described in our [quickstart]({{
"/reference/#quick-start" | relative_url }}) for these examples. To start the all-in-one client, on port 8080, first run:

```console
$ docker run -p 8080:8080 -d turbinelabs/all-in-one-client:0.12.0
```

Then expose the container as a Consul service:

```console
$ curl <your ip address>:8500/v1/catalog/register -d '
{% include_relative examples/consul/all-in-one-client.json %}'
```

Now start the all-in-one server, on port 8081:

```console
$ docker run -d \
  -p 8081:8080 \
  -e "TBN_COLOR=1B9AE4" \
  -e "TBN_NAME=blue" \
  turbinelabs/all-in-one-server:0.12.0
```

Then expose the container as a Consul service:

```console
$ curl <your ip address>:8500/v1/catalog/register -d '
{% include_relative examples/consul/all-in-one-server-blue.json %}'
```

Ensure that these containers have started correctly by running:

```console
$ docker ps
```

```shell
CONTAINER ID        IMAGE                                 COMMAND                  CREATED             STATUS              PORTS                    NAMES
71988c96464a        turbinelabs/all-in-one-server:0.12.0   "/bin/sh -c 'node ..."   57 seconds ago      Up 55 seconds       0.0.0.0:8081->8080/tcp   eloquent_franklin
bd949c322beb        turbinelabs/all-in-one-client:0.12.0   "/bin/sh -c 'envte..."   3 minutes ago       Up 3 minutes        0.0.0.0:8080->8080/tcp   upbeat_snyder
8d759aff4c90        turbinelabs/tbncollect:latest         "/sbin/my_init"          3 minutes ago       Up 3 minutes                                 musing_roentgen
```

{% include guides/verify_tbncollect.md %}

{% include guides/adding_a_domain.md %}

## Deploying tbnproxy

Now we're ready to deploy tbnproxy, using the `signed_token` you obtained with
`tbnctl`, along with the Zone and Proxy names:

```console
$ docker run -d \
  -p 80:80 \
  -e "TBNPROXY_API_KEY=<your signed_token>" \
  -e "TBNPROXY_API_ZONE_NAME=<your zone name>" \
  -e "TBNPROXY_PROXY_NAME=<your proxy name>" \
  turbinelabs/tbnproxy:0.12.0
```

## Verifying your deploy

You should now have tbnproxy running locally on port 80, serving both the all-
in-one client and server. Visit [localhost](http://localhost) in your browser to
verify.

{%
  include guides/demo_exercises_whats_going_on.md
  platform="Consul"
%}

{% include guides/deployed_state.md %}

{% include guides/setup_initial_route.md %}

### Deploying a new version

Now we'll deploy a new version of the server that returns green as the color to
paint blocks, on port 8082:

```console
$ docker run -d \
  -p 8082:8080 \
  -e "TBN_COLOR=83D061" \
  -e "TBN_NAME=green" \
  turbinelabs/all-in-one-server:0.12.0
```

Then expose the container as a Consul service:

```console
$ curl <your ip address>:8500/v1/catalog/register -d '
{% include_relative examples/consul/all-in-one-server-green.json %}'
```

Ensure that all containers have started correctly by running:

```console
$ docker ps
```

```shell
CONTAINER ID        IMAGE                                 COMMAND                  CREATED             STATUS              PORTS                          NAMES
d544d8bcecdb        turbinelabs/all-in-one-server:0.12.0   "/bin/sh -c 'node ..."   43 seconds ago      Up 41 seconds       0.0.0.0:8082->8080/tcp         fervent_kilby
c90dea77b4fb        turbinelabs/tbnproxy:latest           "/sbin/my_init"          6 minutes ago       Up 6 minutes        0.0.0.0:80->80/tcp, 9999/tcp   serene_hodgkin
71988c96464a        turbinelabs/all-in-one-server:0.12.0   "/bin/sh -c 'node ..."   13 minutes ago      Up 13 minutes       0.0.0.0:8081->8080/tcp         eloquent_franklin
bd949c322beb        turbinelabs/all-in-one-client:0.12.0   "/bin/sh -c 'envte..."   15 minutes ago      Up 15 minutes       0.0.0.0:8080->8080/tcp         upbeat_snyder
8d759aff4c90        turbinelabs/tbncollect:latest         "/sbin/my_init"          15 minutes ago      Up 15 minutes                                      musing_roentgen
```

{% include guides/your_environment.md %}

{% include guides/testing_before_release.md %}

{% include guides/incremental_release.md %}

{% include guides/testing_latency_and_error_rates.md %}

### Driving synthetic traffic

If you'd like to drive steady traffic to your all-in-one server without keeping
a browser window open, you can run the all-in-one-driver image. If you are
running tbnproxy on a port other than 80, you'll need to specify it using the
`ALL_IN_ONE_DRIVER_HOST` environment variable. You can also add error rates and
latencies for various using environment variables:

```console
$ docker run -d \
  -e "ALL_IN_ONE_DRIVER_LATENCIES=blue:50ms,green:20ms" \
  -e "ALL_IN_ONE_DRIVER_ERROR_RATES=blue:0.01,green:0.005" \
  turbinelabs/all-in-one-driver:0.10.1
```

{% include guides/conclusion.md
   platform="Consul"
%}

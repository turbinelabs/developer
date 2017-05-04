---
layout: page
title: ECS Guide
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

[//]: # (Integrating Houston with ECS)

{%
  include guides/prerequisites.md
  platform="ECS"
  quick_start_name="Getting Started with ECS"
  quick_start_url="http://docs.aws.amazon.com/AmazonECS/latest/developerguide/ECS_GetStarted.html"
%}

## Setting up service discovery

Install tbncollect with this task definition and note the variables you'll need
to modify to match your environment and API key. Please note you can only
run one collector per Turbine Labs' zone:

```json
{% include_relative examples/ecs/tbncollect_spec.json %}
```

With your task definition created, you can proceed to run Create Service from
the ECS control panel, or through the CLI:

```console
$ aws ecs \
create-service \
  --cluster default \
  --service-name tbncollect \
  --task-definition tbncollect:1 \
  --desired-count 1
```

## The all-in-one demo

### Configure your tasks and containers

In order for tbncollect to see your all-in-one tasks, you'll need to add a
Cluster tag, which is attached to a container definition within a task
definition. Clusters are the grouping that tbncollect uses for services, and in
the case of ECS, are comprised of one or more tasks. A task can be one, or many
containers, but as long as the container includes the same Cluster tag as a
Docker label, the containers will be grouped together.

Please note that using the same label for each container in a task will give
you multiple instances inside a Cluster in the Turbine Labs service.

The construction of the tag inside of a task definition looks like this for the
server:

```json
"dockerLabels": {
  "tbn-cluster": "all-in-one-server:8080"
},
```

and this for the client:

```json
"dockerLabels": {
  "tbn-cluster": "all-in-one-client:8080"
},
```

The label key is the "Cluster tag", which will associate the container with a
Turbine Labs' Cluster, and the value is Turbine Labs' Cluster name and port.
Example task definitions are included later, which include these labels.

### Install the all-in-one-server

Next, use following task definition is for the
all-in-one-server-blue which returns the color blue to the all-in-one-client.

```json
{% include_relative examples/ecs/all_in_one_server_blue.json %}
```

Create a service with this task definition on an ECS cluster of your choosing.

```console
aws ecs \
create-service \
  --cluster default \
  --service-name server-blue \
  --task-definition server-blue:1 \
  --desired-count 1
```

### Install the all-in-one-client

The following task definition is for the all-in-one-client, which will
show the results of the color returned by the all-in-one-server visually as a
blue block.

```json
{% include_relative examples/ecs/all_in_one_client.json %}
```

Create a service with this task definition on an ECS cluster of your choosing.

```console
$ aws ecs \
create-service \
  --cluster default \
  --service-name client \
  --task-definition client:1 \
  --desired-count 1
```

{% include guides/adding_a_domain.md %}

### Create tbnproxy

Create tbnproxy with this task definition and note the NGINX variables you'll
need to modify with values for your environment. tbnproxy will be visible to
the web, and your customer's traffic. tbnproxy will also need network
connectivity to all ECS tasks.

This [tbnproxy task definition](examples/ecs/tbnproxy_spec.json) can be adapted
to your needs or environment:

```json
{% include_relative examples/ecs/tbnproxy_spec.json %}
```

Create a service with this task definition on an ECS cluster of your choosing.

{% include guides/ecs/elb.md %}

{% include guides/aws/verifying.md %}

{%
  include guides/demo_exercises_whats_going_on.md
  platform="ECS"
%}

{% include guides/deployed_state.md %}

{% include guides/setup_initial_route.md %}

### Deploying a new version

Now we'll deploy a new version of the server that returns green as the color to
paint blocks. Use this task definition to create a service for a new server that
returns the color green to the all-in-one-client.

```json
{% include_relative examples/ecs/all_in_one_server_green.json %}
```

Create a service with this task definition on an ECS cluster of your choosing.

```console
$ aws ecs \
create-service \
  --cluster default \
  --service-name server-green \
  --task-definition server-green:1 \
  --desired-count 1
```

{% include guides/aws/your_environment.md %}

{% include guides/testing_before_release.md %}

{% include guides/incremental_release.md %}

{% include guides/testing_latency_and_error_rates.md %}

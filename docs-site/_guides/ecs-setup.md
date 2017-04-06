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

## Follow the [configuration guide]({{ "/reference#configuration" | relative_url }})
This will ensure your API key, domain, zone, routes, and other key components
are set up correctly.

## Configure your tasks and containers
In order for tbncollect to see your ECS tasks, you'll need to add a cluster
tag, which is attached to a container definition within a task definition.
Clusters are the grouping that tbncollect uses for services, and in the case of
ECS, are comprised of one or more tasks. A task can be one, or many containers,
but as long as the container includes the same cluster tag as a docker label,
the containers will be grouped together.

Please note that using the same label for each container in a task will give
you multiple instances inside a cluster in the Turbine Labs service.

The construction of the tag looks like this:

```javascript
"tbn-cluster": "svc1:80,svc2:8088"
```

The label key is the "cluster tag", which will associate the container with a
Turbine Labs' cluster, and the value is Turbine Labs' cluster name and port.

[Example task definition](examples/ecs/task_spec.json):

```javascript
{% include_relative examples/ecs/task_spec.json %}
```

## Install tbncollect
Install tbncollect with this task definition and note the variables you'll need
to modify to match your environment and API key. Please note you can only
run one collector per Turbine Labs' zone:

```command
aws ecs \
  register-task-definition \
    --family collector \
    --container-definitions='[
]'
```

This [tbncollect task definition](examples/ecs/tbncollect_spec.json) notes the values
used for tbncollect:

```javascript
{% include_relative examples/ecs/tbncollect_spec.json %}
```

With your task definition created, you can proceed to run Create Service from
the ECS control panel, or through the CLI:

```shell
aws ecs \
create-service \
  --cluster default \
  --service-name collector \
  --task-definition collector:1 \
  --desired-count 1
  ```

## Mapping an ELB
With tbncollect running, create an Elastic Load Balancer through the AWS
management console to send traffic through to your tbnproxy container, which we
will launch next, on the appropriate ports - in this example, TCP port 80.

## Install tbnproxy
Install tbnproxy with this task definition and note the NGINX variables you'll
need to modify with values for your environment. tbnproxy will be visible to
the web, and your customer's traffic. tbnproxy will also need network
connectivity to all ECS tasks.

```shell
aws ecs \
  register-task-definition \
    --family tbnproxy \
    --container-definitions='[
]'
```

This [tbnproxy task definition](examples/ecs/tbnproxy_spec.json) can be adapted to
your needs or environment:

```javascript
{% include_relative examples/ecs/tbnproxy_spec.json %}
```

With your task definition created, you can proceed to run Create Service using
this container and your ELB from the [ECS control panel](http://docs.aws.amazon.com/AmazonECS/latest/developerguide/create-service.html#service-configure-load-balancing), or through the CLI:

```shell
aws ecs \
create-service \
  --cluster default \
  --service-name tbnproxy \
  --task-definition tbnproxy:1 \
  --desired-count 1
  --load-balancers <the ELB you created above goes here>
  ```


Verify your tasks are being seen by tbncollect by curling the Turbine Labs API:

```shell
curl -s -H "X-Turbine-API-Key: <your api key>" https://api.turbinelabs.io/v1.0/cluster/<your cluster key>
```

Your site or application should now be available to users:

```shell
curl <ip address> -H "Host: <my.example.domain>"
```


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

## Follow the [Configuration guide](https://docs.turbinelabs.io/docs/versions/1.0/configuration)
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

_Example task definition_

```javascript
{
  "attributes": null,
  "requiresAttributes": [
    {
      "value": null,
      "name": "com.amazonaws.ecs.capability.docker-remote-api.1.18",
      "targetId": null,
      "targetType": null
    }
  ],
  "taskDefinitionArn": "arn:aws:ecs:us-east-1:123456:task-definition/ecs-demo-httpd:1",
  "networkMode": "bridge",
  "status": "ACTIVE",
  "revision": 1,
  "taskRoleArn": null,
  "containerDefinitions": [
    {
      "volumesFrom": [],
      "memory": 100,
      "extraHosts": null,
      "dnsServers": null,
      "disableNetworking": null,
      "dnsSearchDomains": null,
      "portMappings": [
        {
          "hostPort": 0,
          "containerPort": 80,
          "protocol": "tcp"
        },
        {
          "hostPort": 0,
          "containerPort": 80,
          "protocol": "tcp"
        }
      ],
      "hostname": null,
      "essential": true,
      "mountPoints": [],
      "name": "c1",
      "ulimits": null,
      "dockerSecurityOptions": null,
      "environment": [],
      "links": null,
      "workingDirectory": null,
      "readonlyRootFilesystem": null,
      "image": "httpd:latest",
      "command": null,
      "user": null,
      "dockerLabels": {
        "tbn-cluster": "svc1:80,svc2:8088"
      },
      "logConfiguration": null,
      "cpu": 0,
      "privileged": null,
      "memoryReservation": null
    },
    {
      "volumesFrom": [],
      "memory": 100,
      "extraHosts": null,
      "dnsServers": null,
      "disableNetworking": null,
      "dnsSearchDomains": null,
      "portMappings": [
        {
          "hostPort": 5432,
          "containerPort": 5432,
          "protocol": "tcp"
        }
      ],
      "hostname": null,
      "essential": true,
      "entryPoint": null,
      "mountPoints": [],
      "name": "c2",
      "ulimits": null,
      "dockerSecurityOptions": null,
      "environment": [],
      "links": null,
      "workingDirectory": null,
      "readonlyRootFilesystem": null,
      "image": "test/httpd:latest",
      "command": null,
      "user": null,
      "dockerLabels": {
        "tbn-cluster": "node:8090"
      },
      "logConfiguration": null,
      "cpu": 0,
      "privileged": null,
      "memoryReservation": null
    }
  ],
  "placementConstraints": null,
  "volumes": [],
  "family": "ecs-demo-httpd"
}
```

## Install tbncollect
Install tbncollect with this task definition and note the variables you'll need
to modify to match your environment and API key. Please note you can only
install one cluster per Turbine Labs' zone:

```command
aws ecs \
  register-task-definition \
    --family collector \
    --container-definitions='[
  {
    "name": "collector",
    "image": "tbncollect:latest",
    "cpu": 1,
    "memory": 128,
    "memoryReservation": 128,
    "essential": true,
    "command": [],
    "environment": [
      {
        "name": "TBNCOLLECT_API_KEY",
        "value": "your TBN api key"
      },
      {
        "name": "TBNCOLLECT_API_ZONE_NAME",
        "value": "your TBN zone name"
      },
      {
        "name": "TBNCOLLECT_ECS_AWS_ACCESS_KEY_ID",
        "value": "your AWS access key"
      },
      {
        "name": "TBNCOLLECT_ECS_AWS_REGION",
        "value": "your AWS region"
      },
      {
        "name": "TBNCOLLECT_ECS_AWS_SECRET_ACCESS_KEY",
        "value": "your AWS secret access key"
      }
    ]
  }
]'
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
    {
      "name": "tbnproxy",
      "image": "tbnproxy:latest",
      "cpu": 1,
      "memory": 128,
      "memoryReservation": 128,
      "essential": true,
      "command": [],
      "environment": [
        {
          "name": "TBNPROXY_API_KEY",
          "value": "<your api key>"
        },
        {
          "name": "TBNPROXY_API_ZONE_NAME",
          "value": "<your zone name>"
        },
        {
          "name": "TBNPROXY_PROXY_NAME",
          "value": "<your proxy name>"
        }
      ],
      "image": "tbnproxy:latest",
      "command": [],
      "cpu": 0,
    }
  ],
  "volumes": [],
  "family": "tbnproxy"
  }
]'
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

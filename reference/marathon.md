
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

[//]: # (Deploying the Turbine Labs Product Suite to Marathon)

## Follow the [Configuration guide](https://docs.turbinelabs.io/docs/versions/1.0/configuration)
This will ensure your API key, domain, zone, routes, and other key components are set up correctly.

## Initial Setup of Marathon

To configure Marathon.

1. First setup your DC/OS install using [this guide](https://dcos.io/docs/1.8/administration/installing/cloud/aws/) if you use AWS.

2. [This guide](https://dcos.io/docs/1.8/usage/tutorials/marathon/marathon101/) will walk you through the initial setup of installing Marathon on top of DC/OS.
    - If your Marathon apps use a private registry, you should be aware of [this document](https://mesosphere.github.io/marathon/docs/native-docker-private-registry.html) on adding private Docker registries.

3. You may also be interested in the [DC/OS CLI](https://docs.mesosphere.com/1.7/usage/cli/install/)


## Configuring tbncollect
In order to install tbncollect you can either configure the application using the GUI in Marathon to fill in each section of the setup, or drop the following JSON file into the JSON section:

Be sure to fill in *your api key*, and *your zone name* (found by querying with: `curl -s -H "X-Turbine-API-Key: <your api key>" https://api.turbinelabs.io/v1.0/zone`).
).

```javascript
{
  "id": "/tbncollect",
  "cmd": null,
  "cpus": 1,
  "mem": 128,
  "disk": 0,
  "instances": 1,
  "env": {
    "TBNCOLLECT_API_KEY": "$TBN_API_KEY",
    "TBNCOLLECT_CMD": "marathon",
    "TBNCOLLECT_API_ZONE_NAME": "<your zone name>"
  },
  "portDefinitions": [
    {
      "port": 10101,
      "protocol": "tcp",
      "labels": {}
    }
  ],
  "container": {
    "type": "DOCKER",
    "volumes": [],
    "docker": {
      "image": "turbinelabs/tbncollect",
      "network": "BRIDGE",
      "portMappings": [
        {
          "containerPort": 0,
          "hostPort": 0,
          "servicePort": 10101,
          "protocol": "tcp",
          "labels": {}
        }
      ],
      "privileged": false,
      "parameters": [],
      "forcePullImage": false
    }
  },
  "healthChecks": [
    {
      "protocol": "TCP",
      "gracePeriodSeconds": 300,
      "intervalSeconds": 60,
      "timeoutSeconds": 20,
      "maxConsecutiveFailures": 3,
      "ignoreHttp1xx": false,
      "port": 8080
    }
  ],
  "labels": {
  },
  "acceptedResourceRoles": [
  ]
}
```

You can also deploy the app via the command line with:

```shell
dcos marathon app add </path/to/tbncollect.json>
```

## Deploying the Demo App
In order for your application to be seen by tbncollect you will need to add it to an Application Group in Marathon. Create a JSON file (<your group>.json)

Be sure to fill in *your group*, *your app*, and *your cluster name* (found by querying with: `curl -s -H "X-Turbine-API-Key: <your api key>" https://api.turbinelabs.io/v1.0/cluster`).**

```javascript
{
  "apps": [
    {
      "id": "/<your group>/<your app>",
      "cmd": null,
      "cpus": 0.1,
      "mem": 64,
      "disk": 0,
      "instances": 1,
      "portDefinitions": [
        {
          "port": 0,
          "protocol": "tcp",
          "labels": {}
        }
      ],
      "container": {
        "type": "DOCKER",
        "volumes": [],
        "docker": {
          "image": "<your company>/<your app>",
          "network": "BRIDGE",
          "portMappings": [
            {
              "containerPort": 0,
              "hostPort": 8080,
              "servicePort": 0,
              "protocol": "tcp",
              "labels": {}
            }
          ],
          "privileged": false,
          "parameters": [],
          "forcePullImage": false
        }
      },
      "healthChecks": [
        {
          "protocol": "TCP",
          "gracePeriodSeconds": 300,
          "intervalSeconds": 60,
          "timeoutSeconds": 20,
          "maxConsecutiveFailures": 3,
          "ignoreHttp1xx": false,
          "port": 8080
        }
      ],
      "labels": {
        "tbn_cluster": "<your cluster name>"
        },
      "acceptedResourceRoles": [
      ]
    }
  ],
  "dependencies": [],
  "groups": [],
  "id": "/<your group>"
}
```

Then, load your new Application Group and Application into Marathon with this command:

```shell
dcos marathon group add > <your group>.json
```

### Verifying Deployment
Once it deploys, you should be able to curl to see the instance being picked up by the collector:

```shell
curl -s -H "X-Turbine-API-Key: $TBN_API_KEY" https://api.turbinelabs.io/v1.0/cluster/<your cluster key>
```

*Example Response*

```javascript
{
  {
    "cluster_key":"<your cluster key>",
    "zone_key":"<your zone key>",
    "name":"<your zone name>",
    "instances":
    [
      {
        "host":"123.456.78.90",
        "port":8080,
        "metadata":
        [
          {
            "key":"HAPROXY_GROUP",
            "value":"external,internal"
          },
          {"key":
            "app/id","value": "/<your group>/<your app>"
          },
          {
            "key":"app/required_cpus",
            "value":"0.100"
          },
          {
            "key":"app/required_disk",
            "value":"0.000"
          },
          {
            "key":"app/required_mem",
            "value":"64.000"
          },
          {
            "key":"app/version",
            "value":"2016-00-28T20:55:55.193Z"
          }
        ]
      }
    ],
    "deleted_at":null,
    "checksum":"<checksum value>"
  }
}%
```

## Configuring and deploying tbnproxy
With tbncollect running, you can move on to configuring and deploying tbnproxy. Use your preferred method of loading apps to deploy the app with the following JSON file.

Be sure to fill in *your api key*, *your zone name*, which found by querying with:

```shell
curl -s -H "X-Turbine-API-Key: $TBN_API_KEY" https://api.turbinelabs.io/v1.0/zone
```

and <your proxy name> found by querying with:

```shell
curl -s -H "X-Turbine-API-Key: $TBN_API_KEY" https://api.turbinelabs.io/v1.0/proxy
```

*Example tbnproxy JSON*

```javascript
{
  "id": "/tbnproxy",
  "cmd": null,
  "cpus": 0.1,
  "mem": 1024,
  "disk": 0,
  "instances": 1,
  "env": {
    "TBNPROXY_API_KEY":"<your api key>",
    "TBNPROXY_API_ZONE_NAME":"<your zone name>",
    "TBNPROXY_PROXY_NAME":"<your proxy name>"
  },
  "uris": [
    "URI to your Docker Hub or private repo key"
  ],
  "container": {
    "type": "DOCKER",
    "volumes": [],
    "docker": {
      "image": "turbinelabs/tbnproxy:latest",
      "network": "BRIDGE",
      "privileged": false,
      "parameters": [],
      "forcePullImage": false
    }
  },
  "healthChecks": [
    {
      "protocol": "TCP",
      "gracePeriodSeconds": 300,
      "intervalSeconds": 60,
      "timeoutSeconds": 20,
      "maxConsecutiveFailures": 3,
      "ignoreHttp1xx": false,
      "port": 8080
    }
  ],
  "labels": {
    "HAPROXY_GROUP": "external,internal"
  },
  "acceptedResourceRoles": [
  ]
}
```

## Adding a new app to your group
Modify your group's JSON file to add another version of your app, and then update your Application Group with this command:

```shell
dcos marathon group update <your group> < group.json
```

*Example group.json*

```javascript
{
  "apps": [
    {
      "id": "/mygroup/hello-node",
      "cmd": null,
      "cpus": 1.0,
      "mem": 128,
      "disk": 0,
      "instances": 1,
      "portDefinitions": [
        {
          "port": 0,
          "protocol": "tcp",
          "labels": {}
        }
      ],
      "container": {
        "type": "DOCKER",
        "volumes": [],
        "docker": {
          "image": "turbinelabs/basicnode",
          "network": "BRIDGE",
          "portMappings": [
            {
              "containerPort": 0,
              "hostPort": 8080,
              "servicePort": 0,
              "protocol": "tcp",
              "labels": {}
            }
          ],
          "privileged": false,
          "parameters": [],
          "forcePullImage": false
        }
      },
      "healthChecks": [
        {
          "protocol": "TCP",
          "gracePeriodSeconds": 300,
          "intervalSeconds": 60,
          "timeoutSeconds": 20,
          "maxConsecutiveFailures": 3,
          "ignoreHttp1xx": false,
          "port": 8080
        }
      ],
      "labels": {
        "HAPROXY_GROUP": "external,internal",
        "tbn_cluster": "hello-node"
      },
      "acceptedResourceRoles": [
        "slave_public"
      ]
    },
    {
      "id": "/mygroup/hello-node2",
      "cmd": null,
      "cpus": 1.0,
      "mem": 128,
      "disk": 0,
      "instances": 1,
      "portDefinitions": [
        {
          "port": 0,
          "protocol": "tcp",
          "labels": {}
        }
      ],
      "container": {
        "type": "DOCKER",
        "volumes": [],
        "docker": {
          "image": "turbinelabs/basicnode",
          "network": "BRIDGE",
          "portMappings": [
            {
              "containerPort": 0,
              "hostPort": 8088,
              "servicePort": 0,
              "protocol": "tcp",
              "labels": {}
            }
          ],
          "privileged": false,
          "parameters": [],
          "forcePullImage": false
        }
      },
      "healthChecks": [
        {
          "protocol": "TCP",
          "gracePeriodSeconds": 300,
          "intervalSeconds": 60,
          "timeoutSeconds": 20,
          "maxConsecutiveFailures": 3,
          "ignoreHttp1xx": false,
          "port": 8080
        }
      ],
      "labels": {
        "HAPROXY_GROUP": "external,internal",
        "tbn_cluster": "hello-node"
      }
    }
  ],
  "dependencies": [],
  "groups": [],
  "id": "/mygroup"
}
```

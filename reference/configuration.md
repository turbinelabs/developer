
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

[//]: # (Initial Setup of the tbnproxy integration)

Our public API models your application from the customer's perspective
(domains) and infrastructure's perspective (clusters, instances,
zones). Proxies, shared rules, and routes map requests from one to the
other. This provides a clear view of the structure of your
application, as well as powerful tools for modifying that
structure. Integrated metrics show you the behavior of the system,
providing an at-a-glance view of user experience. All changes to
system structure are logged, and can be correlated with metrics.

This guide walks you through the initial configuration steps for tbnproxy
integration with your microservice scheduler or applications.

## Before you get started
Email [support@turbinelabs.io](mailto:support@turbinelabs.io) with your
[DockerHub](https://hub.docker.com) account, and a
[Github](https://www.github.com) account and we'll get you set up with an
account.

Please note: tbnctl (coming soon!) is a CLI for interacting with the Turbine
Labs public API. In the meantime the same steps can be accomplished with curl.

## Overview of tbnproxy initial setup
You'll be going through the following steps to configure tbnproxy integration:

1. Create a zone.

2. Set up a Domain <my.example.com> which is conceptually served by a single
demo application.

3. Create a Cluster, which is set of instances all performing a homogeneous set
of tasks.

4. Create SharedRules as a base for this and future routes.

5. A single Route (“/”) is mapped to this Cluster. The Route will send traffic
to any members of the application group with an app label with value
“prismatic-spray”.

6. Create a proxy object that will be configured to serve the Domain
<my.example.com>.

### Setting up your zone in the Turbine Labs API
In this example, you will set up a Domain with a single Route, “/”, that will
forward all traffic to a running prismatic-spray application. This instance is
represented in the Turbine Labs API as a Cluster.

- First, you need to get an API key. Email support@turbinelabs.io and we send
one to you.

- Next, you will create a zone with the following command. A Zone is a logical
deployment of services, which typically maps to a datacenter, region, or
compute cluster.

```command
cat zone.json  | tbnctl --api.key="<your api key>" create zone
```

*example zone.json*
```javascript
{
  "name": "<your zone name>"
}
```

*example response*
```javascript
{
  "zone_key": "<your zone key",
  "name": "<your zone name>",
  "checksum": "<your checksum value>"
}
```

Alternatively, with `curl`:

```command
curl -s -H "X-Turbine-API-Key: $TBN_API_KEY" -d@zone_post.json https://api.turbinelabs.io/v1.0/zone
```

*example zone_post.json*

```javascript
{
  "name":"<your zone name>"
}
```

#### Creating a domain
Now that you've set up a Zone, you'll create a Domain. This represents the URL
space of your service, in this case <my.example.com>

```command
cat domain_post.json  | tbnctl --api.key="<your api key> create domain
```

*example domain_post.json*

```javascript
{"zone_key": "<your zone key>", "name": "<my.example.com>", "port": 80}
```

*example Response:*

```javascript
{
  "zone_key": "<your zone key>",
  "name": "<my.example.com>",
  "checksum": "<your checksum value>",
  "domain_key": "<your domain key>",
  "port": 80
}
```
Alternatively, with `curl`:

```command
curl -s -H "X-Turbine-API-Key: $TBN_API_KEY" -d@domain_post https://api.turbinelabs.io/v1.0/domain
```

*Example domain post*

```javascript
{"zone_key": "<your zone key>", "name": "<my.example.com>", "port": 80}
```


#### Creating a proxy

With a domain created, you’ll create a representation of your tbnproxy, and map
it to to the domain you just created.

```command
cat proxy.json | tbnctl --api.key="your_api_key" create proxy
```

*example contents of proxy.json*

```javascript
{
  "host": "<my.example.com>",
  "port": 80,
  "zone_key": "<your zone key>",
  "name": "<tbnproxy-1>",
  "domain_keys":["<your domain key>"]
}
```

*example response*:

```javascript
{
  "host": "<my.example.com>",
  "port": 80,
  "metadata": null,
  "proxy_key": "<your proxy key>",
  "zone_key": "<your zone key>",
  "name": "<tbnproxy-1>",
  "domain_keys": ["<your domain keys"],
  ": ": "<your checksum value>",
}
```

Alternatively, with `curl`:

```command
curl -s -H "X-Turbine-API-Key: $TBN_API_KEY" -d@proxy_post.json https://api.turbinelabs.io/v1.0/proxy
```

*Example contents of proxy_post.json*

```javascript
{
  "host": "<my.example.com>",
  "port": 80,
  "zone_key": "<your zone key>",
  "name": "<tbnproxy-1>",
  "domain_keys":["<your domain key>"]
}
```

*Example response*:

```javascript
{
   "result" : {
      "domain_keys" : ["<your domain keys"],
      "port" : 80,
      "name" : "<tbnproxy-1>",
      "host" : "<my.example.com>",
      "zone_key" : "<your zone key>",
      "proxy_key" : "<your proxy key>",
      "checksum" : "<checksum value>",
      "metadata" : null
   }
}
```

#### Creating a cluster

Next, you'll create a Cluster in the Turbine Labs API. A Cluster represents
a set of services all performing a homogeneous set of tasks. Note that
tbncollect will automatically create clusters for discovered services, but
manually creating a cluster here allows you to create a route for the service
before jumping ahead to tbncollect configuration.

```command
cat cluster.json | tbnctl --api.key="<your api key>" create cluster
```

*example cluster.json*
```shell
{
  "zone_key": "<your zone key>",
  "name": "prismatic-spray"
}
```

*example Response:*

```javascript
{
  "cluster_key": "<your cluster key>",
  "zone_key": "<your zone key>"
  "name": "prismatic-spray",
  "instances": null,
  "checksum": "<checksum value>",
}
```

Alternatively, with `curl`:

```command
curl -s -H "X-Turbine-API-Key: $TBN_API_KEY" -d '{"zone_key": "<your zone key>", "name": "hello-node"}' https://api.turbinelabs.io/v1.0/cluster
```

*Example Response:*

```javascript
{
   "result" : {
      "name" : "hello-node",
      "instances" : null,
      "checksum" : "<checksum value>",
      "cluster_key" : "<your cluster key>",
      "zone_key" : "<your zone key>"
   }
}
```

#### Creating shared rules
With the cluster created, you can now create shared rules, which provide
default behavior for one or more routes.

```command
cat sharedrules.json | tbnctl --api.key="<your api key>" create shared_rules
```

*example sharedrules.json*
```javascript
{
  "name":"<your shared rules name>",
  "zone_key":"<your zone key>",
  "default":
  {
      "light": [
          {
              "cluster_key": "<your cluster key>",
              "weight": 1
          }
      ]
  }
}
```

*example response*

```javascript
{
  "shared_rules_key":"<your shared rules key",
  "name":"<your shared rules name>",
  "zone_key":"<your zone key>",
  "default":
  {
    "light":
    [
      {
        "constraint_key":"<your constraint key>",
        "cluster_key":"<your cluster key>",
        "metadata":null,
        "properties":null,
        "weight":1
      }
    ],
    "dark":null,
    "tap":null
  },
  "rules":null,
  "deleted_at":null,
  "checksum":"<your checksum value>"
}
```

Alternatively, with `curl`:

```command
curl -s -H "X-Turbine-API-Key: $TBN_API_KEY" -d@shared_rules_post.json https://api.turbinelabs.io/v1.0/shared_rules
```

*example shared_rules_post_json*
```javascript
{
  "name":"<your shared rules name>",
  "zone_key":"<your zone key>",
  "default":
  {
      "light": [
          {
              "cluster_key": "<your cluster key>",
              "weight": 1
          }
      ]
  }
}
```

*example response*

```javascript
{
  "shared_rules_key":"<your shared rules key",
  "name":"<your shared rules name>",
  "zone_key":"<your zone key>",
  "default":
  {
    "light":
    [
      {
        "constraint_key":"<your constraint key>",
        "cluster_key":"<your cluster key>",
        "metadata":null,
        "properties":null,
        "weight":1
      }
    ],
    "dark":null,
    "tap":null
  },
  "rules":null,
  "deleted_at":null,
  "checksum":"<your checksum value>"
}
```


#### Creating a route
Last you’ll create a route to map incoming traffic to a Cluster. In this case
you’ll simply map all incoming traffic to the prismatic-spray cluster you just
created

```command
cat route.json | tbnctl --api.key="<your api key>" create route
```

*example route.json*
```javascript
{
  "domain_key": "<your domain key>",
  "zone_key": "<your zone key>",
  "shared_rules_key": "<your shared rules key",
  "path": "/"
}
```

*example Response:*

```javascript
{
   "result": {
      "checksum": "<your checksum value>",
      "zone_key": "<your zone key>",
      "route_key": "<your route key>",
      "shared_rules_key": "<your shared rules key",
      "path": "/",
      "domain_key": "<your domain key>"
   }
}
```

Alternatively, with `curl`:

```command
Curl -s -H “X-Turbine-API-Key: $TBN_API_KEY” -d@route_post.json https://api.turbinelabs.io/v1.0/route
```

*Example route_post.json*
```javascript
{
  "domain_key": "<your domain key>",
  "zone_key": "<your zone key>",
  "shared_rules_key" : "<your shared rules key",
  "path": "/",
}
```

*Example Response:*

```javascript
{
   "result" : {
      "checksum" : "<checksum value>",
      "zone_key" : "<your zone key>",
      "route_key" : "<your route key>",
      "shared_rules_key" : "<your shared rules key",
      "path" : "/",
      "domain_key" : "<your domain key>"
   }
}
```
### Reviewing the steps

- You've created a zone.

- You've also set up a Domain <my.example.com> which is conceptually served
by a single application (“prismatic-spray”).

- Following these, you've created a Cluster, which is set of instances all
performing a homogeneous set of tasks.

- You've created SharedRules as a base for this and future routes.

- A single Route (“/”) is mapped to this Cluster. The Route will send traffic
to any members of the application group with an app label with value
“prismatic-spray”.

- You’ve also created a proxy object that will be configured to serve the
Domain <my.example.com>.

## Next steps
With your initial setup complete, choose one of the below cloud platforms to
learn how to install, run, and use tbnproxy:

- [Kubernetes](https://docs.turbinelabs.io/guides/integrating-houston-with-kubernetes)

- [Marathon](https://docs.turbinelabs.io/guides/integrating-houston-with-marathon)

- [Docker on EC2](https://docs.turbinelabs.io/guides/integrating-houston-with-docker-on-ec2)

- [ECS](https://docs.turbinelabs.io/guides/integrating-houston-with-ecs

- [Consul](https://docs.turbinelabs.io/guides/integrating-houston-with-consul)

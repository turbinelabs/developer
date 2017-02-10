
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

## Follow the [configuration guide](https://docs.turbinelabs.io/docs/versions/1.0/configuration)
This will ensure your API key, domain, zone, routes, and other key components
are set up correctly.

##  Installing on EC2
For this guide, we will assume you have a running Consul instance, as well as
defined services. The following will show you how to launch tbncollect and
tbnproxy on EC2 within Docker containers, but if you prefer launching with a
different configuration tool, please take note of the ports needed, as well as
environment labeling.

You will need:
- Two EC2 micro instances running Docker on an OS of your choice. Be sure to
configure security groups for these instances according to the the following
list.
- ELBGroup: a security group for your ELB
  - Open ports:
    TCP 80 inbound from the internet
- TBNProxyGroup: a security group for your tbnproxy instance
  - Open ports:
    TCP 80 from ELBGroup
    SSH 22 inbound from the internet

Your existing Consul services will also need the following:
  - Open ports:
    8080 from the IP of the tbnproxy instance

## Labeling your Consul nodes
In order for tbncollect to see your Consul nodes, they will need the label
`tbn-cluster`, which you can add in your service definitions as in this example:

```javascript
{
  "service": {
    "name": "node",
    "tags": ["tbn-cluster"],
    "address": "999.888.777.1",
    "port": 8080,
    "enableTagOverride": false,
    "checks": [
      {
      }
    ]
  }
}
```
Once your nodes are running with this label, tbncollect will be able to take
note of them, and tbnproxy will be able to route user traffic from its IP
appropriately.

## tbncollect and tbnproxy

### Installing tbncollect
Choose a micro instance, note the IP address, and SSH into it.

#### Run tbncollect
Now, you can install and run tbncollect on your new micro EC2 instance, with
your environment variables defined inside of the docker command:

```shell
docker run -e "TBNCOLLECT_API_KEY=<your api key>" -e "TBNCOLLECT_API_ZONE_NAME=<your zone name>" -e "TBNCOLLECT_DC=<your datacenter>" -e "TBNCOLLECT_CMD=consul" turbinelabs/tbncollect:latest
```

_use `tbncollect help consul` to determine which environmental variables you can use and modify_

Verify your Consul instances and services are being seen by tbncollect by
curling the Turbine Labs API. Your cluster name should be URL encoded, and is
the name of the service labeled with "tbn-cluster".

```shell
curl -g -s -H "X-Turbine-API-Key: <your api key>" "api.turbinelabs.io/v1.0/cluster?filter[0].cluster_name=<cluster name>"
```

*Example Result*

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
        []
      }
    ],
    "deleted_at":null,
    "checksum":"<checksum value>"
  }
}%
```

### Installing tbnproxy
With tbncollect seeing your instances, move on to launching tbnproxy with the
following command on the same instance as the collector with ports forwarded
appropriate to your service or site:

```shell
docker run -p 80:80 -d -e "TBNPROXY_API_KEY=<your api key>" -e "TBNPROXY_API_ZONE_NAME=<your zone name>" -e "TBNPROXY_PROXY_NAME=tbnproxy-1" turbinelabs/tbnproxy:latest
```

SSH into this instance, and curl your new tbnproxy server's IP address at port
80 from this instance, to verify that tbnproxy is successfully routing traffic
to one of your node web servers.

## Mapping an ELB
With your instance running both tbncollect and tbnproxy, create an Elastic Load
Balancer through the AWS management console to send traffic through to your
tbncollect and tbnproxy node on the appropriate ports - in this example, TCP
port 80.
- Apply security group ELBGroup

Once the ELB is up, you should be able to see your app or site in a browser, or with curl:

```shell
curl <ip address> -H "Host: <my.example.domain>""
```

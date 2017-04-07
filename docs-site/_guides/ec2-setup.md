---
layout: page
title: EC2 Guide
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

[//]: # (Integrating Houston with Docker on EC2)

## Follow the [configuration guide]({{ "/reference#configuration" | relative_url }})

This will ensure your API key, domain, zone, routes, and other key components are set up correctly.

##  Installing on EC2
You will need:
- Three EC2 micro instances running Docker on an OS of your choice. Be sure to
configure security groups for these instances according to the the following
list.
- ELBGroup: a security group for your ELB
  - Open ports:
    TCP 80 inbound from the internet
- TbnProxyGroup: a security group for your tbnproxy instance
  - Open ports:
    TCP 80 from ELBGroup
    SSH 22 inbound from the internet
- AppGroup: a security group for your application instances
  - Open ports:
    8080 from TRPGroup
    SSH 22 inbound from the internet

*[This guide will help if you want to run Docker on Ubuntu] (https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-on-ubuntu-16-04).*

### Installing the test node app
While configuring your instances to launch, be sure to add a tag, which in our
example would be `"tbn:cluster:hellonode"="8080"`, to two of the three. These
two instances are where you will install the test node app, or your own apps.
You may run multiple different apps on different ports of the same instance;
the tags are used to let the collector know which app is running on which port.

### Running the test app
With your new EC2 instances running Docker, you can now run the following test
Node app after using SSH to connect to both of them.

```shell
docker run -p 8080:8080 -d turbinelabs/hellonode
```

SSH into one node server instance, and curl your new node server's IP address
at port 8080, if you are using the test app, to verify it is exposed.

### Installing tbncollect
Choose your third micro instance, note the IP address, and SSH into it.

#### Run tbncollect
Now, you can install and run tbncollect on your third new micro EC2 instance,
with your environment variables defined inside of the docker command:

```shell
docker run -e "TBNCOLLECT_API_KEY=<your api key>" -e "TBNCOLLECT_API_ZONE_NAME=<your zone name>" -e "TBNCOLLECT_AWS_AWS_ACCESS_KEY_ID=<your aws access key>" -e "TBNCOLLECT_AWS_AWS_REGION=<your aws region>" -e "TBNCOLLECT_AWS_AWS_SECRET_ACCESS_KEY=<your secret access key>" -e "TBNCOLLECT_AWS_VPC_ID=<your vpc id>" -e "TBNCOLLECT_CMD=aws" turbinelabs/tbncollect:0.6.1
```

Verify the node instances are being seen by tbncollect by curling the Turbine
Labs API:

```shell
curl -s -H "X-Turbine-API-Key: <your api key>" https://api.turbinelabs.io/v1.0/cluster/<your cluster key>
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
docker run -p 80:80 -d -e "TBNPROXY_API_KEY=<your api key>" -e "TBNPROXY_API_ZONE_NAME=<your zone name>" -e "TBNPROXY_PROXY_NAME=tbnproxy-1" turbinelabs/tbnproxy:0.6.1
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

Once the ELB is up, you should be able to see your app or site in a browser, or
with curl:

```shell
curl <ip address> -H "Host: <my.example.domain>"
```

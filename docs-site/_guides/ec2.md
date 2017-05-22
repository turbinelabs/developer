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

{%
  include guides/prerequisites.md
  platform="Docker on EC2"
  quick_start_name="Docker Basics"
  quick_start_url="http://docs.aws.amazon.com/AmazonECS/latest/developerguide/docker-basics.html"
%}

##  Installing on EC2

You will need:

- Three EC2 micro instances running Docker on an OS of your choice. Be sure to
configure security groups with open ports for these instances according to the
the following list. You'll also need the VPC ID of the VPC these instances are located on.
- ELBGroup: a security group for your ELB
  - TCP 80 inbound from the internet
- TBNProxyGroup: a security group for your tbnproxy instance
  - TCP 80 from ELBGroup
  - SSH 22 inbound from the internet
- AppGroup: a security group for your application instances
  - 8080 from TBNProxyGroup
  - SSH 22 inbound from the internet

## Setting up service discovery

Install and run tbncollect on your third new micro EC2 instance,
with your environment variables defined inside of the docker command:

```console
$ docker run -d \
  -e "TBNCOLLECT_API_KEY=<your api key>"
  -e "TBNCOLLECT_API_ZONE_NAME=<your zone name>" \
  -e "TBNCOLLECT_AWS_AWS_ACCESS_KEY_ID=<your aws access key>" \
  -e "TBNCOLLECT_AWS_AWS_REGION=<your aws region>" \
  -e "TBNCOLLECT_AWS_AWS_SECRET_ACCESS_KEY=<your secret access key>" \
  -e "TBNCOLLECT_AWS_VPC_ID=<your vpc id>" \
  -e "TBNCOLLECT_CMD=aws" \
  turbinelabs/tbncollect:0.8.1
```

## The all-in-one demo

Pick an instance to install the all-in-one client on and another to install the
server on. You may run multiple different apps on different ports of the same
instance; the tags are used to let the collector know which app is running on
which port.

### Running the all-in-one-client

With your new EC2 instances running Docker, you can now run the
all-in-one-client after using SSH to connect to your second instance.

```console
$ docker run -p 8080:8080 -d turbinelabs/all-in-one-client:0.8.1
```

### Running the all-in-one-server

With your new EC2 instances running Docker, you can now run the
all-in-one-client after using SSH to connect to your third instance.

```console
$ docker run -d \
  -p 8080:8080 \
  -e "TBN_COLOR=1B9AE4" \
  -e "TBN_NAME=blue" \
  turbinelabs/all-in-one-server:0.8.1
```

Once the instance is running, add the following tags in the EC2 Console for the
server:

```
"tbn:cluster:all-in-one-server"="8080"
"tbn:cluster:all-in-one-server:color"="blue"
```

and this for the client:

```
"tbn:cluster:all-in-one-client"="8080"
```

{% include guides/adding_a_domain.md %}

## Installing tbnproxy

With tbncollect seeing your instances, move on to launching tbnproxy with the
following command on the same instance as the collector with ports forwarded
appropriate to your service or site:

```console
$ docker run -d \
  -p 80:80 \
  -e "TBNPROXY_API_KEY=<your api key>" \
  -e "TBNPROXY_API_ZONE_NAME=<your zone name>" \
  -e "TBNPROXY_PROXY_NAME=<your proxy name>" \
  turbinelabs/tbnproxy:0.8.1
```

### Mapping an ELB to expose tbnproxy

With your instance running both tbncollect and tbnproxy, create an Elastic Load
Balancer through the AWS management console to send traffic through to your
tbncollect and tbnproxy node on the appropriate ports—in this example, TCP
port 80. Next, apply the security group: ELBGroup.

{% include guides/configure_routes.md %}

## Verifying your deploy

With your ELB running, locate its external IP, and visit it in your browser.
You should be able to see blue boxes in a grid, blinking in and out, as they
represent responses from the blue version of the all-in-one-server we launched
previously.

{%
  include guides/demo_exercises_whats_going_on.md
  platform="EC2"
%}

{% include guides/deployed_state.md %}

{% include guides/setup_initial_route.md %}

## Deploying a new version

Now we'll deploy a new version of the server that returns green as the
color to paint blocks. SSH into the instance that is running your current
all-in-one-client, then run a new Docker container with this command:

```console
$ docker run -d \
  -p 8081:8081 \
  -e "TBN_COLOR=83D061" \
  -e "TBN_NAME=green" \
  turbinelabs/all-in-one-server:0.8.1
```

Once the instance is running, add the following tags in the EC2 Console:

```
"tbn:cluster:all-in-one-server"="8081"
```

and

```
"tbn:cluster:all-in-one-server:color"="green"
```

{% include guides/your_environment.md %}

{% include guides/testing_before_release.md %}

{% include guides/incremental_release.md %}

{% include guides/testing_latency_and_error_rates.md %}

{% include guides/conclusion.md
   platform="EC2"
%}

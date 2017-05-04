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
  platform="EC2"
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

{% include guides/aws/now_install_tbncollect.md %}

```console
$ docker run -e "TBNCOLLECT_API_KEY=<your api key>" -e "TBNCOLLECT_API_ZONE_NAME=<your zone name>" -e "TBNCOLLECT_AWS_AWS_ACCESS_KEY_ID=<your aws access key>" -e "TBNCOLLECT_AWS_AWS_REGION=<your aws region>" -e "TBNCOLLECT_AWS_AWS_SECRET_ACCESS_KEY=<your secret access key>" -e "TBNCOLLECT_AWS_VPC_ID=<your vpc id>" -e "TBNCOLLECT_CMD=aws" turbinelabs/tbncollect:0.7.0
```

{% include guides/aws/the_all_in_one_demo.md %}

{% include guides/adding_a_domain.md %}

{% include guides/aws/installing_tbnproxy.md %}

{% include guides/aws/mapping_elb.md %}

{% include guides/configure_routes.md %}

{% include guides/aws/verifying.md %}

{%
  include guides/demo_exercises_whats_going_on.md
  platform="Docker on EC2"
%}

{% include guides/deployed_state.md %}

{% include guides/setup_initial_route.md %}

{% include guides/aws/deploying_new.md %}

{% include guides/aws/your_environment.md %}

{% include guides/testing_before_release.md %}

{% include guides/incremental_release.md %}

{% include guides/testing_latency_and_error_rates.md %}

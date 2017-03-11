---
layout: page
title: Similar Systems
print_order: 7
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

## ELB

Amazon's Elastic Load Balancer (ELB) is the standard load balancing solution
for AWS. It provides basic layer 4 and layer 7 load balancing as well as SSL
termination, and is deeply integrated with AWS networking. Houston works
well in conjunction with ELB, offering:
  * Finer grained layer 7 request routing
  * Deeper, customer-centric request metrics
  * A web UI optimized to quickly and safely shift production traffic
  * Load balancing across multiple service ports
  * Integration with service discovery systems (Kubernetes, Marathon)

## ALB

Amazon recently released their Application Load Balancer (ALB). It adds support
for HTTP/2, web sockets, and balancing across multiple service ports (provided
you're using ECS, Amazon's Container Service). Houston also works well in
conjunction with ALB, offering most of the same advantages over ELB:
  * Finer grained layer 7 request routing
  * Deeper, customer-centric request metrics
  * A web UI optimized to quickly and safely shift production traffic
  * Integration with service discovery systems (Kubernetes, Marathon)

## NGINX

NGINX is one of the most commonly used reverse proxies, and Houston uses
it for traffic handling. Compared to a standard NGINX proxy Houston adds:
  * A centralized configuration management UI
  * Deeper, customer-centric request metrics
  * Finer grained layer 7 request routing
  * Configuration change logging
  * Integration with service discovery systems (Kubernetes, Marathon, EC2)

## HAProxy

HAProxy is another widely used software load balancer. The advantages Houston
provides over a standard HAProxy install are similar to its advantages
over NGINX:
  * A centralized configuration management UI
  * Deeper, customer centric request metrics
  * Finer grained layer 7 request routing
  * Configuration change logging
  * Integration with service discovery systems (Kubernetes, Marathon, EC2)

## Kong

Kong is an API gateway that simplifies identity and access management
for public APIs. Houston is focused on managing the mapping of
customer requests to application infrastructure. Kong and Houston are
complementary, and can work together.

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

Houston is an application and routing and release system. It combines
capabilities usually found in web proxies, logging solutions and
monitoring tools. It's the synthesis of these things into a product
squarely focused on providing a flexible, yet stable experience to
customers that sets it apart.

## Traffic Control

Houston can replace your existing web proxy, or work in conjunction
with it. Compared to popular proxies (NGINX, HAProxy, ELB, ALB)
Houston supports finer grained request routing, and has a more
detailed view of your deployed services. Houston's proxy is
dynamically configured directly from the Turbine Labs API, so changes
to configuration are simple and responsive.

## Logging

Houston collects, stores, and visualizes all configuration and state 
changes related to your software release. In most release systems
the configuration and management of logging collectors is tedious,
error prone, and low fidelity. Houston provides you a great solution
out of the box, and can also integrate with your existing logging
systems, enriching the data you already collect and store.

## Monitoring

Houston collects, stores, and visualizes a concise yet comprehensive
set of metrics that give you an easily digestible view of your site
health. Most monitoring systems require invasive instrumentation and
provide an overwhelming flood of metrics. Houston collects a focused
set of metrics that let you understand what your customers are seeing,
without the code surgery. Houston provides you a great high level
picture of service health, and can forward metrics to your monitoring
system for a more detailed analysis of incidents that arise.

## CI/CD

Houston understands that deploying code to hardware shouldn't be the
same step as releasing it to customers. Existing CI/CD tools are great
for packaging and deploying software, but don't integrate the logging,
monitoring and traffic control you need for a robust release to your
customers. Houston integrates the information you need to feel
confident in your software release and increase your pace of
iteration.

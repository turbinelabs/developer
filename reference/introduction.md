
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

Turbine Labs provides a system that lets you fluidly map customer requests to infrastructure. Your customers expect a stable, performant API, while you need to iterate its implementation and feature set.

## Use cases
  - [Blue/green deploys](#bluegreen)
  - [Monolith decomposition / architecture migration](#monolith)
  - [Testing with production traffic and/or backends](#testing)

## Terms to know
  - tbnproxy: an indirection layer between customer traffic and your application. It runs in your environment, routing traffic based on rules you define and service discovery metadata.
  - Prismatic Spray: a simple HTTP server application that returns hex color value strings for demo use only.

![High Level](https://d16co4vs2i1241.cloudfront.net/uploads/tutorial_image/file/619373600171886104/f551346c135b128460c7c5999d797b594f090fb202fa4665541261ce5a4e32ec/column_sized_Dev_Diagram.png)
The Turbine Labs API models both the customer view of the world (domains) and systems view of the world (clusters, instances, zones). Proxies, shared rules, and routes allow you to map requests between the customer and systems views. Integrated metrics let you see changes in the quality of the user experience at a glance, and the change log lets you correlate them to changes with your infrastructure.

# Use Cases

## Blue/Green Deploys <a id="bluegreen"></a>

Blue/Green deploy (aka Red/Black deploys or A/B deploys) is a technique detailed by Martin Fowler [here](http://martinfowler.com/bliki/BlueGreenDeployment.html). Rather than deploying and restarting software in place, you bring up new infrastructure alongside it. Then you can safely and incrementally shift traffic from your old infrastructure to the new one.

The Turbine Labs API supports arbitrary labeling of service instances, and the ability to route traffic based on those labels (e.g. "send traffic to instances with version=1.0"). After deploying software with a new version, you can route a small amount of traffic to it and observe its behavior. Our dashboard lets you easily compare request rate, success rate and latency between versions. If the new version looks good, you can send it more traffic. If it doesn't, you can shift traffic back to the old version.

![Blue Green](https://d16co4vs2i1241.cloudfront.net/uploads/tutorial_image/file/619522435309372492/7c81a781e975adf9508288affee8ecd139ea1fc92065d69b4f9b1bd60994a6cc/column_sized_Blue_Green.png)

## Monolith Decomposition <a id="monolith"></a>

Many applications begin life as a single, monolithic service. As both the application and the team grow, there is often a desire to split the monolith into smaller services. Turbine Labs' flexible routing lets you execute these splits with minimal client disruption. Split out the route you plan to migrate, without affecting production traffic. Then use the same tools and methods you use for blue/green deploy to safely and incrementally shift traffic for that route from the monolith to your new service.

![Decomposition Small](https://d16co4vs2i1241.cloudfront.net/uploads/tutorial_image/file/619374110996170265/c046cb79cd3c4bfe13100877b3c684311c46d2f40d5cadfce97e4ff04d4d60a7/column_sized_Decomposition_Small.png)

## Testing in Production <a id="testing"></a>

There are a lot of ways to test software. Unit tests, integration tests, staging environments, and manual test suites are all good at catching different classes of defects. But bugs slip through to production even with these methods. Turbine Labs' flexible approach to routing lets you set up routes based on headers or cookies to send traffic to new, non-public versions of software. Engineers can deploy and evaluate their code, on their schedule, without affecting customers. Defects in failed production releases can be safely root-caused; Simply shift customer traffic to a known-good version, and allow engineers to inspect the bad version at their own pace.

![Test In Prod Small](https://d16co4vs2i1241.cloudfront.net/uploads/tutorial_image/file/619523023711503438/c0148fd31bc12f12806d1623abef5af92f8fc4467c24ea0ac1b46ab7e7bf9c1a/column_sized_Test_in_Prod_Small.png)

# Architecture

The Turbine Labs product consists of a combination of hosted and on-premise components. Our proxy is installed in your environment, along with a service discovery collector tailored to your infrastructure. Our hosted API, web application, and analytics backend provide a control plane to operate, visualize, and manage your installation.

![Architecture](https://d16co4vs2i1241.cloudfront.net/uploads/tutorial_image/file/619523276946801743/65b450fc60ee0ac11008d050294b32c812b87dfe8eec201e07b508419cbb9dff/column_sized_Architecture.png)

## In Your Environment

### Collector

The collector is an agent that scans your environment for running service clusters and instance tags. It has integrations with Kubernetes, Marathon/Mesos, and EC2, with more integrations on their way. It can also read from a YAML or JSON file. Changes to your environment are mirrored to the Turbine Labs API.

### Proxy

The NGINX-based proxy is responsible for receiving customer requests and dispatching them to appropriate service instances. An admin server runs alongside the proxy, and is responsible for managing its configuration and forwarding request/response metrics to the Turbine Labs API. When it detects changes in your environment, it updates and reloads the NGINX configuration.

## Hosted by Turbine Labs

### API

The Turbine Labs API provides a central, hosted management service for environment configuration and metrics. It maintains a catalog of the zones, domains, routes, service clusters and instances, and proxies in your environment. It also provides a detailed log of changes to these objects, with a query interface for request/response metrics dimensionalization.

### Management UI

The management UI, built atop the Turbine Labs API, provides a simple, intuitive interface for managing and observing the state of your environment. Release new software, migrate to new architectures, triage incidents, all in a single, consistent interface. Understand the current behavior of your site, and know what has changed, at any level of granularity.

# Supported Deployment Platforms

While the Turbine Labs software will run on a wide variety of architectures, we've built specific integrations with [Kubernetes](https://docs.turbinelabs.io/guides/deploying-the-turbine-labs-product-suite-to-kubernetes), [Marathon/Mesos](https://docs.turbinelabs.io/guides/deploying-the-turbine-labs-product-suite-to-marathon), and [EC2](https://docs.turbinelabs.io/guides/deploying-the-turbine-labs-product-suite-to-docker-on-ec2). We plan to add more integrations in the future, and because all on-premise code will be open sourced, it will be possible to create your own.

# Comparison to Similar Systems

## ELB

Amazon's Elastic Load Balancer (ELB) is the standard load balancing solution for AWS. It provides basic layer 4 and layer 7 load balancing as well as SSL termination, and is deeply integrated with AWS networking. Turbine Labs works well in conjunction with ELB, offering:
  * Finer grained layer 7 request routing
  * Deeper, customer-centric request metrics
  * A web UI optimized to quickly and safely shift production traffic
  * Load balancing across multiple service ports
  * Integration with service discovery systems (Kubernetes, Marathon)

## ALB

Amazon recently released their Application Load Balancer (ALB). It adds support for HTTP/2, web sockets, and balancing across multiple service ports (provided you're using ECS, Amazon's Container Service). Turbine Labs also works well in conjunction with ALB, offering most of the same advantages over ELB:
  * Finer grained layer 7 request routing
  * Deeper, customer-centric request metrics
  * A web UI optimized to quickly and safely shift production traffic
  * Integration with service discovery systems (Kubernetes, Marathon)

## NGINX

NGINX is one of the most commonly used reverse proxies, and Turbine Labs uses it for traffic handling. Compared to a standard NGINX proxy Turbine Labs adds:
  * A centralized configuration management UI
  * Deeper, customer-centric request metrics
  * Finer grained layer 7 request routing
  * Configuration change logging
  * Integration with service discovery systems (Kubernetes, Marathon, EC2)

## HAProxy

HAProxy is another widely used software load balancer. The advantages Turbine Labs provides over a standard HAProxy install are similar to its advantages over NGINX:
  * A centralized configuration management UI
  * Deeper, customer centric request metrics
  * Finer grained layer 7 request routing
  * Configuration change logging
  * Integration with service discovery systems (Kubernetes, Marathon, EC2)

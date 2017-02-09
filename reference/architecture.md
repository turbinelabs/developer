
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

Houston, by Turbine Labs, consists of several components. Our proxy is
installed in your environment, along with a service discovery
collector configured for your infrastructure. Our hosted API, web
application, and analytics backend provide a control plane to observe
and manage your application.

<img src="http://img.turbinelabs.io/2017-02-09/arch_lm.svg"/>

## In your environment

### tbncollect

tbncollect is an agent that scans your environment for running service
clusters and instance labels. It has integrations with Kubernetes,
Marathon/Mesos, Consul, ECS, and EC2, with more integrations on their
way. It can also poll a YAML or JSON file, for static or custom
integrations. Changes to your environment are mirrored to the Turbine
Labs API.

### tbnproxy

The NGINX-based proxy is responsible for receiving customer requests and
dispatching them to appropriate service instances. An admin server runs
alongside the proxy, and is responsible for managing its configuration and
forwarding request/response metrics to the Turbine Labs API. When it detects
changes in your environment, it updates and reloads the NGINX
configuration, with no downtime.

## Hosted by Turbine Labs

### API

Our public API provides a central, hosted management service for
environment configuration and metrics. It maintains a catalog of the zones,
domains, routes, service clusters and instances, and proxies in your
environment. It also provides a detailed log of changes to these objects, with
a query interface for request/response metrics dimensionalization.

### Management web app

The UI, built on top of our public API, provides a simple, intuitive
interface for managing and observing the state of your environment.
You can <a href="#incremental-release">release new software</a>, <a
href="#monolith">migrate to new architectures</a>, triage incidents,
all in a single, consistent interface. You can understand the current
behavior of your site, and know what has changed, at any level of
granularity.

# Supported deployment platforms

While the Turbine Labs software will run on a wide variety of
architectures, we've built specific integrations
with
[Kubernetes](https://docs.turbinelabs.io/guides/deploying-the-turbine-labs-product-suite-to-kubernetes),
[Marathon/Mesos](https://docs.turbinelabs.io/guides/deploying-the-turbine-labs-product-suite-to-marathon),
and
[EC2](https://docs.turbinelabs.io/guides/deploying-the-turbine-labs-product-suite-to-docker-on-ec2),
[ECS](https://docs.turbinelabs.io/guides/deploying-the-turbine-labs-product-suite-to-ecs),
and
[Consul](https://docs.turbinelabs.io/guides/deploying-the-turbine-labs-product-suite-to-consul). We
plan to add more integrations in the future, and our YAML/JSON file
polling mechanism provides extensibility if you wish to create your
own.

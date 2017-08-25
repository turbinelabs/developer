---
layout: page
title: Integrating Houston and Your Kubernetes Environment
time_to_complete: 5 minutes
child: true
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

[//]: # (Best practices for using Kubernetes with Houston)

## Intro

This guide discusses best practices for deploying Houston in your Kubernetes
cluster in order to collect, route, and move faster with your code.

## Prerequisites

This guide assumes you’ve looked over our [Kubernetes Guide](./kubernetes.html)
for Houston, and have a Kubernetes environment configured. You may also
find our [Customizing tbncollect](./kubernetes_customizing_tbncollect.html)
guide useful as you configure your environment.

## CI/CD to Houston

Any CI or CD tool works well with Houston. Ultimately, CD infrastructure
should set up new pods with [these labels](#labels), and Houston takes it from
there. Be sure to read the [reasons to decouple](https://blog.turbinelabs.io/deploy-not-equal-release-part-one-4724bc1e726b) [release from deployment](https://blog.turbinelabs.io/deploy-not-equal-release-part-two-acbfe402a91c).

## Proxy

We recommend a single ingress tbnproxy deployment per Kubernetes cluster, with
three or more replicas. While one proxy replica is ok, three is N+2 redundant,
allowing for sufficient capacity and greater resilience during individual node
failure.

### Exposing Your Proxy

To expose tbnproxy to the Internet, run the following, which should work in
most cloud providers:

`kubectl expose deployment --type=LoadBalancer <foo>`

## Zones

A Zone corresponds to a single routable IP-space. In the case of Kubernetes,
Zones typically map to a full cluster, though they can also map to a single
namespace. A collector is needed for each Zone.

## Collector

We recommend a single replica of the collector to minimize the resource
footprint. It's fine to run more than one replica in the deployment, but
because brief outages during pod or node restart will not meaningfully affect
system performance, there's no particular advantage.

## Labels <a name="labels"></a>

In order to determine a pod's association with a service, you can use the
env var: `TBNCOLLECT_KUBERNETES_CLUSTER_LABEL=<foo>` in your yaml configuration
at `spec.template.labels` (without an override the default value is `tbn_cluster`). The
collector will collect any cluster data with that label, and ignore the rest of
your un-labeled, or differently-labeled clusters.

There are good reasons to use a different cluster label than a currently in-use
label in your Kubernetes environment, as you may not want tbncollect to collect
every pod. See [this guide](./kubernetes_customizing_tbncollect.md) for
more information on changing this label, as well as other collection and query
changes that apply to using Houston with Kubernetes.

In addition to a cluster label, the following labels are required on each pod
to participate in the Houston release workflow:

- `stage` represents the stage of development (eg `dev` or `prod`). Only `prod`
will be collected for the release workflow. Located in `spec.template.labels`
of your yaml config file.
- `version` should map 1:1 to an identifier in your release tracking system,
e.g., version control tag, branch, or SHA. Located in `spec.template.labels` of
your yaml config file.

Here is an example file from the [Kubernetes guide](./kubernetes.md) to illustrate these labels:

```yaml
{% include_relative examples/kubernetes/label.yaml %}
```

### Port labels

A single port can be collected per pod, and that port's name must be the value
of the `TBNCOLLECT_KUBERNETES_PORT_NAME` environment variable, which by default
is `http`. All other ports are ignored. Located in `spec.containers.ports` of
your yaml config file.

## Conclusion

Now that you've seen what best practices look like for running Houston and
using Kubernetes in your environment, you can try it with your own Kubernetes
services. If you have questions or run into any trouble, please [drop us a line](mailto:support@turbinelabs.io), we're here to help.

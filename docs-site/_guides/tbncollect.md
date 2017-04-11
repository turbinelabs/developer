---
layout: page
title: tbncollect Guide
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

[//]: # (Guide to tbncollect)

## What is service discovery?

In a broad sense, service discovery is the automatic detection of devices,
services, containers, etc. that exist on a network. In our case, service
discovery is how Houston, by Turbine Labs, is able to see and take note of your
services and instances, regardless of their provisioner.

## What does tbncollect do?

tbncollect is a process that runs in your environment, customized to your
infrastructure. It collects every running instance of a service that is
correctly labeled using whatever labeling scheme is appropriate (e.g.
Kubernetes, Marathon uses app labels, EC2 uses instance tags). It can also read
from a yaml file. By using tbcollect, you ensure that Houston has an accurate
understanding of your services.

Services and instances are stored in the Turbine Labs API, mirroring the state
of your environment, which is the source of truth. You can view them from
Houston, but they are read-only.

## tbncollect flags and environment variables

Each supported platform for tbncollect can be customized with flags or
environment variables. The list of available platforms can be found with
`tbncollect -h`, and individual platform flags can be found with
`tbncollect <platform> -h`. Flags can be passed on the command line, or can be
set via environment variables; for example `--cluster-label` for the Kubernetes
platform can be set with `TBNCOLLECT_KUBERNETES_CLUSTER_LABEL`. Note the
pattern of stating the command in caps, then the platform, and finally the
flag, also in caps, with all non-alphanumeric chars converted to underscores. So
for Marathon, the ENV variables would be set with
`TBNCOLLECT_MARATHON_<FLAG_NAME>`.

### Deletion and creation flags

These flags control the behavior of API cluster creation or deletion based on
the diff from the previous dataset found in the API and the currently collected
services and instances.

- `--diff.ignore-create` **not commonly used**
The default flag is `false`, but if the value is set to `true`, tbncollect will
not create new services present in the collected dataset but missing from the
API.

- `--diff.include-delete` **use with extreme caution—this is not recoverable**
The default flag is `false`, but if it is set to `true`, tbncollect will delete
services present in the API but missing from the collected dataset. It can be
useful to turn this on incidentally to help in service cleanup, but it is
potentially very dangerous to leave on all the time.

### Other general flags

- `--console.level=level`
The default value is `info`. Other valid values are `debug`, `error`, or
`none`. This global flag selects the log level for console logs messages. All
console logs are sent to `STDERR`.

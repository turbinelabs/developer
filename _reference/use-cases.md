---
layout: page
title: Use Cases
print_order: 2
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

<a id="incremental-release"></a>
## Incremental release

Blue/green deploy (aka Red/Black deploys or A/B deploys) is a
technique detailed by Martin Fowler -
[here](https://martinfowler.com/bliki/BlueGreenDeployment.html).
Instead of upgrading software in place, you deploy new instances running new
software. Once it's running, you switch over customer traffic. If it
goes bad, you switch back to your still-running old service. Houston's
built-in release workflow is similar, but allows you to shift traffic
incrementally to your new software. Instead of an atomic cutover to
the new version, Houston lets you shift a small percentage of traffic
to the new version, compare behavior of the old and new system, and
proceed when you're confident the user experience won't be
impacted. Canceling the release is simple and fast. It's just routing
traffic away from the new version.

<img width="70%" height="70%" alt="Blue Green" src="https://img.turbinelabs.io/2017-02-09/bluegreen_lm.svg"/>

<a id="testing"></a>
## Testing in production

There are a lot of ways to test software. Unit tests, integration tests,
staging environments, and manual test suites are all good at catching different
classes of defects. But bugs slip through to production even with these
methods. Houston's flexible approach to routing lets you set up routes
based on headers or cookies to send traffic to new, non-public versions of
software. Engineers can deploy and evaluate their code, on their schedule,
without affecting customers. Defects in failed production releases can be
safely root-caused; Simply shift customer traffic to a known-good version, and
allow engineers to inspect the bad version at their own pace.

<img width="70%" height="70%" alt="Test in Prod" src="https://img.turbinelabs.io/2017-02-09/testinprod_lm.svg"/>

<a id="monolith"></a>
## Monolith decomposition

Many applications begin life as a single, monolithic service. As both the
application and the team grow, there is often a desire to split the monolith
into smaller services. Houston's flexible routing lets you execute these
splits with minimal client disruption. Split out the route you plan to migrate,
without affecting production traffic. Then use the same tools and methods you
use for blue/green deploy to safely and incrementally shift traffic for that
route from the monolith to your new service.

<img width="70%" height="70%" alt="Decomp" src="https://img.turbinelabs.io/2017-02-09/decomp_lm.svg"/>

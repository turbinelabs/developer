
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

## Introducing Houston, by Turbine Labs

Iterating rapidly while maintaining a stable experience is difficult,
especially in an industry where the state of the art is in constant
flux. Turbine Labs bridges the gap. With Houston, our application
routing and release system, you can confidently test your code in
production, release it incrementally, or rebuild your infrastructure,
with no visible impact to customers.

## Update your roadmap, not your site map

Product success depends on constant innovation, but it shouldn’t come
at the expense of customer experience. As you add new features, test
and release new software, or replace legacy infrastructure, your
customers’ experience should continue uninterrupted. Houston lets you
map customers’ traffic to your infrastructure, providing a flexible,
dynamic interface between your changes and their experience.

Houston keeps changes narrowly focused and reversible, reducing the
risk and cost of service outages. You can safely develop features on
production infrastructure that stay invisible until they’re
polished. You can release new software incrementally to customers,
comparing old and new versions as you go. Simply turn off the release
if anything looks wrong. You can use the same approach to migrate to
new infrastructure. Your customers will continue with business as
usual.

## Understand structure and behavior, past and present

Modern architectural trends like containers, orchestration, and
microservices give you unprecedented expressiveness, but are complex
to reason about and difficult to instrument; it’s hard to connect the
dots from what you’ve built to what your customer sees. Houston
bridges the gap, combining a customer-centric approach to monitoring
and observation with insight into changes to your infrastructure.

Houston provides a concise, consistent set of metrics that let you
understand your customer’s experience at any level of granularity,
from the entire domain to a single endpoint. You can slice those same
metrics by service or software version to understand how your changes
affect that experience. Houston keeps a record of these change, making
it easy to correlate them with incidents, compare customer experience
across multiple software versions, and measure the quality and pace of
your software releases.

## You can keep your existing infrastructure

Houston integrates easily with existing systems. Try it out on a
container on a laptop, then deploy it in your normal
process. Houston’s extensible service discovery agent integrates
easily with AWS, Kubernetes, Mesos/Marathon, Consul, and
others. Everything is managed from our hosted application, with a
robust public API for scripting and integration with your existing
management tools.



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

# turbinelabs/developer

[![Apache 2.0](https://img.shields.io/hexpm/l/plug.svg)](LICENSE)

The developer project is meant to describe our methodology for open-sourcing
software.

# Turbine Labs Open Source Projects

There are a few interesting restrictions we placed on ourselves that led to our
methodology for open-sourcing projects:

- We develop our code internally in a monorepo, and feel pretty strongly about
  the benefits of doing so within an organization.

- Much of our code is not (and will not be) open-sourced

- As strongly as we feel developing in a monorepo is great for internal
  development, it's terrible for external developers, who will typically be
  submitting patches to individual projects.

Our goal is to bring many of the benefits of developing in a monorepo (chiefly
atomicity of large changes and compatibility guarantees) to our open-source
projects, while keeping each project relatively small and purpose-driven.

- [Languages](#languages)
- [Homing](#homing)
- [Versioning](#versioning)
- [Dependencies and vendoring](#vendoring)
- [Contributing](#contributing)
- [Project layout](#layout)

## <a name="languages"/>Languages

Our source code is written almost entirely in [Go](https://golang.org/).
Most of what we talk about below is targeted at Go development.

## <a name="homing"/>Homing

The source of truth for all projects is our internal monorepo. We will push
"slices" of it to smaller open-source projects at a roughly weekly cadence.

## <a name="versioning"/>Versioning

We maintain a single, global version string for all Turbine Labs open-source
projects, maintaining with the following invariant:

>**All Turbine Labs projects with the same version can be safely used together.**

The version string follows [Semantic Versioning](http://semver.org/) rules,
but applied to the aggregation of all projects. We push all projects every push
(though some will be no-ops), and we tag all projects with the same version tag.

The main benefit of this approach is that contributors can easily work in
individual projects, while enjoying the compatibility guarantees of our monorepo
as they extend their reach. The downside is that the version increments will
seem pretty chatty, especially for lower-velocity repositories. We may introduce
project-specific semantic version numbers in the future, but for now are
avoiding the operational overhead.

## <a name="vendoring"/>Dependencies and vendoring

Turbine Labs open-source go projects will never publicly depend on anything
other than other Turbine Labs open-source Go projects, with the exception of
[gomock](https://github.com/golang/mock), which is used extensively in our test
code, but whose interfaces are both stable and unused in any part of our public
API.

#### How we vendor

Some of our projects depend on other open-source projects, and in these cases
we vendor those projects within ours. That we do so should be considered an
implementation detail, entirely opaque to consumers of our library code.
Vendored library code is hermetically sealed, and will never be part of the
public types or interfaces of our library projects.

If our open-source projects need to share common dependencies, we will
encapsulate the (private) dependency within a (public) interface.

#### How you should vendor

For repeatable builds, you will probably want to vendor our library projects
rather than depending on `go get`. As long as all vendored packages in the
`github.com/turbinelabs` namespace include the same tag (*not SHA!*), they
can be safely used together.

You may find that you vendor some of the same dependencies that our packages
privately vendor, and this may be a source of consternation to you because of
the size of the resulting source tree or binary. From a correctness standpoint,
it's totally fine (better even) to have multiple versions of the same code
vendored at various levels of your source tree, as long as those vendored
types and interfaces do not escape the API of their enclosing project.

While you may tempt yourself to flatten our vendored dependencies with your own,
we hope to talk you out of it: our code is made to work with the exact code
we've chosen to vendor, and it will work either surprisingly or not at all with
other code. Similarly, you will find it onerous to pin yourself to whatever
old package version we're using. Best to pretend our vendored code isn't there.

## <a name="contributing"/>Contributing

We decided to open-source some of our software because we thought it would be
useful to people outside our company, but we also know the satisfaction gained
from finding and fixing a tricky bug. That's where you come in.

We'd love for you to fork and contribute back to any of our projects, though the
process has a little more overhead than the usual GitHub workflow. Filing issues
for bugs you've found is the same, but pull requests behave a little
differently. While the code review process will feel familiar, because of the
unidirectionality of our open-source export, your pull request will be applied
as a patch in our monorepo, and then pushed back out. We'll do this by hand
until it becomes onerous, at which point we'll build some automation.

If you have a patch that affects multiple projects, that's fine! Be sure to
reference each pull request in each other pull request, and we'll apply the
change in a single patch. Yay monorepo!

## Code of Conduct
All Turbine Labs open-sourced projects are released with a
[Contributor Code of Conduct](CODE_OF_CONDUCT.md). By participating in our
projects you agree to abide by its terms, which will be carefully enforced.

## <a name="layout"/>Project layout

Here we describe each of the projects in brief, and show how they depend on
one another. We will do our best to keep this accurate.

[**`adminserver`**](http://github.com/turbinelabs/adminserver):
wraps a process in simple HTTP server that manages its lifecycle<br>
`├──`[`nonstdlib`](http://github.com/turbinelabs/nonstdlib)<br>
`└──`[`test`](http://github.com/turbinelabs/test)<br>

[**`api`**](http://github.com/turbinelabs/api):
defines the types and interfaces of the Turbine Labs public API<br>
`├──`[`nonstdlib`](http://github.com/turbinelabs/nonstdlib)<br>
`└──`[`test`](http://github.com/turbinelabs/test)<br>

[**`circle-ci-integration`**](http://github.com/turbinelabs/circle-ci-integration):
demonstrates how to utilize GKE, CircleCI, and Houston to build a developer
friendly, yet manageable continuous release pipeline.

[**`cli`**](http://github.com/turbinelabs/cli):
still yet another command line interface library<br>
`├──`[`nonstdlib`](http://github.com/turbinelabs/nonstdlib)<br>
`└──`[`test`](http://github.com/turbinelabs/test)<br>

[**`codec`**](http://github.com/turbinelabs/codec):
a simple interface for encoding and decoding values with JSON and YAML
implementations<br>
`└──`[`test`](http://github.com/turbinelabs/test)<br>

[**`developer`**](http://github.com/turbinelabs/developer): this very project!

[**`docs`**](http://github.com/turbinelabs/docs): the source for our
[documentation site](https://docs.turbinelabs.io)

[**`gcloud-build`**](http://github.com/turbinelabs/houston-crx):
a build base image for a CI environment, based on the
[Google CloudSDK image](https://github.com/GoogleCloudPlatform/cloud-sdk-docker/blob/master/alpine/Dockerfile),
with docker and kubectl installed.

[**`golang-gotchas`**](http://github.com/turbinelabs/golang-gotchas):
examples of some things that might feel awkward if you're coming to Go from
other languages

[**`houston-crx`**](http://github.com/turbinelabs/houston-crx):
source for the Houston Chrome Extension, which lets you easily set version
routing cookies for your Houston-fronted application

[**`nonstdlib`**](http://github.com/turbinelabs/nonstdlib):
extensions to the Go stdlib and other useful utility code<br>
`└──`[`test`](http://github.com/turbinelabs/test)<br>

[**`tbnctl`**](http://github.com/turbinelabs/tbnctl):
command line interface to the Turbine Labs public API<br>
`├──`[`api`](http://github.com/turbinelabs/api)<br>
`├──`[`codec`](http://github.com/turbinelabs/codec)<br>
`├──`[`cli`](http://github.com/turbinelabs/cli)<br>
`├──`[`nonstdlib`](http://github.com/turbinelabs/nonstdlib)<br>
`└──`[`test`](http://github.com/turbinelabs/test)<br>

[**`test`**](http://github.com/turbinelabs/test):
small helper packages to make writing tests in go a little easier<br>

---
layout: page
title: DC/OS Guide
time_to_complete: 10 minutes
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

[//]: # (Integrating Houston with DC/OS)

{%
  include guides/prerequisites.md
  platform="DC/OS"
  quick_start_name="Install DC/OS"
  quick_start_url="https://dcos.io/install/"
  install_extra="You'll also need to [install](https://dcos.io/docs/1.9/cli/install) the `dcos` command-line tool."
%}

## Setting up service discovery

The tbncollect binary scans your DC/OS cluster for pods and groups them into
clusters in the Turbine Labs API.

### Getting your DC/OS Access Token and URL

Before deploying tbncollect to your DC/OS cluster, you'll need an access token
to allow it to talk to the DC/OS API. The easiest way to do this is with the
`dcos` command. First make sure you're authenticated:

```console
$ dcos auth login
```

Follow the instructions to authenticate with your DC/OS cluster, then obtain
the access token by typing:

```console
$ dcos config show core.dcos_acs_token
```

This token will be good for 5 days; way more than enough time to work through
this guide. If you need a longer-lived token, you can
[follow these instructions](https://medium.com/@richardgirges/authenticating-open-source-dc-os-with-third-party-services-125fa33a5add). If you're using enterprise DC/OS, you should be able to create a long-lived
token using the private key from a service account. If you have any trouble
with this, [please let us know](mailto:support@turbinelabs.io), we can work with
you to improve our support for enterprise DC/OS authentication.

You'll also need your DC/OS cluster URL, which can be obtained with:

```console
$ dcos config show core.dcos_url
```

### Deploying tbncollect

To deploy tbncollect to your DC/OS cluster, create a file called
`tbncollect.json`, using the template below, filling in your API key, Zone name,
and DC/OS access token and URL:

```json
{% include_relative examples/dcos/tbncollect_spec.json %}
```

Then create an app using `dcos`:

```console
$ dcos marathon app add tbncollect.json
```

You can watch launch progress from the DC/OS UI, or with the `dcos` command.
When it is launched, you should see this output:

```console
$ dcos marathon app list
ID                        MEM  CPUS  TASKS  HEALTH  DEPLOYMENT  WAITING  CONTAINER  CMD
/tbn/tbncollect           128   1     1/1    ---       ---      False      DOCKER   None
```

## The all-in-one demo

We'll use the same client application described in our [quickstart]({{
"/reference/#quick-start" | relative_url }}) for these examples. To deploy the
all-in-one client, run

```console
$ dcos marathon app add https://docs.turbinelabs.io/guides/examples/dcos/all-in-one-client.json
```

Next, deploy the all-in-one server by running

```console
$ dcos marathon app add https://docs.turbinelabs.io/guides/examples/dcos/all-in-one-server-blue.json
```

Ensure that these apps have started correctly by running:

```console
$ dcos marathon app list
ID                            MEM  CPUS  TASKS  HEALTH  DEPLOYMENT  WAITING  CONTAINER  CMD
/tbn/all-in-one/client         64  0.1    1/1    ---       ---      False      DOCKER   None
/tbn/all-in-one/server/green   64  0.1    1/1    ---       ---      False      DOCKER   None
/tbn/tbncollect               128   1     1/1    ---       ---      False      DOCKER   None
```

Now verify that tbncollect has discovered your new pods and added them to the
appropriate clusters by running:

```console
$ tbnctl list --format=summary cluster
```

You should see a `name: all-in-one-client` cluster with a single instance and a
`name: all-in-one-server` cluster with one instance and a `name:
all-in-one-client`. It may take up to 30 seconds for the new clusters to appear.

{% include guides/adding_a_domain.md %}

Now we're ready to deploy tbnproxy to DC/OS. To deploy tbncollect to your DC/OS
cluster, create a file called `tbncollect.json`, using the template below,
filling in your API key, Zone name, and Proxy name:

```json
{% include_relative examples/dcos/tbnproxy_spec.json %}
```

Note that we're using `HOST` networking on port 80, and fixing the app to a
public slave node. If port 80 is already taken, feel free to use a different
port.

Now create an app using `dcos`:

```console
$ dcos marathon app add tbnproxy.json
```

You can watch launch progress from the DC/OS UI, or with the `dcos` command.
When it is launched, you should see this output:

```console
$ dcos marathon app list
ID                            MEM  CPUS  TASKS  HEALTH  DEPLOYMENT  WAITING  CONTAINER  CMD
/tbn/all-in-one/client         64  0.1    1/1    ---       ---      False      DOCKER   None
/tbn/all-in-one/server/blue    64  0.1    1/1    ---       ---      False      DOCKER   None
/tbn/tbncollect               128   1     1/1    ---       ---      False      DOCKER   None
/tbn/tbnproxy                 128  0.1    1/1    0/1      scale     False      DOCKER   None
```

{% include guides/configure_routes.md %}

## Verifying your deploy

You should now be able to see the all-in-one client by visiting the DC/OS
cluster's public IP on port 80 (or whatever port you chose).

{%
  include guides/demo_exercises_whats_going_on.md
  platform="DC/OS"
%}

{% include guides/deployed_state.md %}

{% include guides/setup_initial_route.md %}

### Deploying a new version

Now we'll deploy a new version of the server that returns green as the color to
paint blocks.

```console
$ dcos marathon app add https://docs.turbinelabs.io/guides/examples/dcos/all-in-one-server-green.json
```

You can watch launch progress from the DC/OS UI, or with the `dcos` command.
When it is launched, you should see this output:

```console
$ dcos marathon app list
ID                            MEM  CPUS  TASKS  HEALTH  DEPLOYMENT  WAITING  CONTAINER  CMD
/tbn/all-in-one/client         64  0.1    1/1    ---       ---      False      DOCKER   None
/tbn/all-in-one/server/blue    64  0.1    1/1    ---       ---      False      DOCKER   None
/tbn/all-in-one/server/green   64  0.1    1/1    ---       ---      False      DOCKER   None
/tbn/tbncollect               128   1     1/1    ---       ---      False      DOCKER   None
/tbn/tbnproxy                 128  0.1    1/1    0/1      scale     False      DOCKER   None
```

{% include guides/aws/your_environment.md %}

{% include guides/testing_before_release.md %}

{% include guides/incremental_release.md %}

{% include guides/testing_latency_and_error_rates.md %}

{% include guides/conclusion.md
   platform="Kubernetes"
%}

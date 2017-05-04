---
layout: page
title: Customizing tbncollect
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

[//]: # (Customizing tbncollect For Your Kubernetes Environment)


## Prerequisites

This guide assumes you have read our
[guide to setting up Houston on Kubernetes](./kubernetes.html), and have an
existing Kubernetes deployment.

## Custom deployment settings

In the previous Kubernetes guide, we instructed users to setup tbncollect using
our [pre-baked yaml file](examples/kubernetes/tbncollect_spec.yaml), but
this file makes a few assumptions about your environment. First of all, it
assumes you have a named http port, then a label named `tbn_cluster`, as well
as a few more settings.

Additionally, tbncollect command-line flags can be specified in the yaml config
using environment variables. Environment variables corresponding to flags are
derived from those flags by first prefixing with the command and subcommand
(in this case TBNCOLLECT_KUBERNETES_), and then converting the flag name to
uppercase and replacing any non-alphanumeric characters with _. So for example,
the --port-name flag becomes TBNCOLLECT_KUBERNETES_PORT_NAME.

These settings are likely different on your existing Kubernetes cluster, so
it's important to configure your tbncollect yaml file to match your environment.

*[example custom_tbncollect_spec.yaml](examples/kubernetes/custom_tbncollect_spec.yaml)*

```yaml
{% include_relative examples/kubernetes/custom_tbncollect_spec.yaml %}
```

Note the values near the bottom of the yaml file—these are a few of the values
you can set either in your CLI or in a yaml file, and the rest may be found in
your CLI by running:

```console
$ tbncollect kubernetes --help
```

*Please note that any flags set explicitly in the CLI invocation will
override values set in a yaml file.*

## Explanation of custom values

### run: tbncollect

Early in the file, you'll need to run tbncollect, and add whatever labels or
namespaces are appropriate to your installation.

### TBNCOLLECT_KUBERNETES_NAMESPACE

This value sets which Kubernetes cluster namespace tbncollect will watch to
gather pods. The default value is: `default`

### TBNCOLLECT_KUBERNETES_CLUSTER_LABEL

This value specifies to which Kubernetes cluster a pod belongs. The default
label is `tbn_cluster`.

### TBNCOLLECT_KUBERNETES_SELECTOR

This value selects which pods are polled from the pods in your cluster and
namespace. The default is no selector.

### TBNCOLLECT_KUBERNETES_PORT_NAME

The named container port assigned to your Kubernetes cluster instances. The
default port name is `http`.

### Custom Cert Values:

If your cluster needs custom keys in
order to be accessed, these are the values to set in order to enable a
connection to your cluster.

`TBNCOLLECT_KUBERNETES_CA_CERT`
`TBNCOLLECT_KUBERNETES_CLIENT_CERT`
`TBNCOLLECT_KUBERNETES_CLIENT_KEY`

### TBNCOLLECT_KUBERNETES_HOST

The host name for the Kubernetes API server. This is required if `tbncollect`
is running outside of the Kubernetes cluster it will poll.

### TBNCOLLECT_KUBERNETES_TIMEOUT

The timeout used for Kubernetes API requests (converted to seconds). The
default value is 2m0s.

### TBNCOLLECT_KUBERNETES_CONSOLE_LEVEL

The default level is: "info". Other values are: "debug", "info", "error", or
"none".

For testing purposes, you may want to run tbncollect with the console level set
to debug. This will help you determine if tbncollect is correctly polling and
recognizing your cluster and pods.

## Running your custom tbncollect

With your environment variables correctly set, you can run tbncollect with the
following command:

```console
$ kubectl create -f <filename of customized tbncollect spec.yaml>
```

## Service Discovery

Once tbncollect is running, and assuming your clusters and selectors are set up
appropriately, it should begin reporting your services to the Turbine Labs API.
You should see them in the Changelog in the [Houston app](https://app.turbinelabs.io/). If you are not seeing your clusters in the
changelog, it's likely one of the settings above is not correctly configured.
Take a look through them, then test again with the modified values, or reach
out to support@turbinelabs.io and we can help you get things configured.

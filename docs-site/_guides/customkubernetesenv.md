# Custom Kubernetes Environment

## Prerequisites
This guide assumes you have read our [guide to setting up Houston on Kubernetes](./kubernetes.md), and have an existing Kubernetes deployment.

## Custom Environment Settings
In the previous Kubernetes guide, we instructed users to setup tbncollect using
our [pre-baked yaml file](../examples/kubernetes/tbncollect_spec.yaml), but
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

*example custom_tbncollect_spec.yaml*

```yaml
kind: Deployment
metadata:
  name: tbncollect
spec:
  replicas: 1
  template:
    metadata:
      labels:
        run: tbncollect
    spec:
      containers:
      - image: turbinelabs/tbncollect:latest
        imagePullPolicy: Always
        name: tbncollect
        env:
        - name: TBNCOLLECT_CMD
          value: kubernetes
        - name: TBNCOLLECT_API_ZONE_NAME
          value: testbed
        - name: TBNCOLLECT_API_KEY
          valueFrom:
            secretKeyRef:
              name: tbnsecret
              key: apikey
        - name: TBNCOLLECT_KUBERNETES_NAMESPACE
          value: customkube
        - name: TBNCOLLECT_KUBERNETES_CLUSTER_LABEL
          value: custom_cluster
        - name: TBNCOLLECT_KUBERNETES_SELECTOR
          value: custom_tbn_pods
        - name: TBNCOLLECT_KUBERNETES_PORT_NAME
          value: space_port
        # - name: TBNCOLLECT_KUBERNETES_CA_CERT
        #  value: path_to_your_cert
        # - name: TBNCOLLECT_KUBERNETES_CLIENT_CERT
        #  value: path_to_your_client_cert
        # - name: TBNCOLLECT_KUBERNETES_CLIENT_KEY
        #  value: path_to_your_cert_key_file
        # - name: TBNCOLLECT_KUBERNETES_HOST
        #  value: custom.example.com
        # - name: TBNCOLLECT_KUBERNETES_TIMEOUT
        #  value: 1m2s
        # - name: TBNCOLLECT_KUBERNETES_CONSOLE_LEVEL
        #  value: debug
```

Note the values near the bottom of the yaml file—these are a few of the values
you can set either in your CLI or in a yaml file, and the rest may be found in
your CLI by running:

`tbncollect kubernetes --help`

*Please note that any flags set explicitly in the CLI invocation will
override values set in a yaml file.*

## Explanation of custom values

### run: tbncollect

Early in the file, you'll need to run tbncollect, and add whatever labels or namespaces are appropriate to your installation.

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

`kubectl create -f https://raw.githubusercontent.com/turbinelabs/developer/master/docs-site/examples/kubernetes/custom_tbncollect_spec.yaml`

## Service Discovery

Once tbncollect is running, and assuming your clusters and selectors are set up
appropriately, it should begin reporting your services to the Turbine Labs API.
You should see them in the Changelog in the [Houston app](https://app.turbinelabs.io/). If you are not seeing your clusters in the
changelog, it's likely one of the settings above is not correctly configured.
Take a look through them, then test again with the modified values, or reach
out to support@turbinelabs.io and we can help you get things configured.

## Prerequisites

### A Turbine Labs API key

Make sure you have a valid Turbine Labs API key. If you don't, email
support@turbinelabs.io to get set up. This tutorial assumes you've set an
environment variable named $TBNCTL_API_KEY to the value of your API key, e.g.,
(in bash)

```console
$ export TBNCTL_API_KEY=ed6b67e9-31d4-4413-5a8d-23c863405ecf
```

### A functional {{ include.platform }} install

If you don't have one, the
[{{ include.quick_start_name }}]({{ include.quick_start_url }}) is a great
resource to get one set up quickly.

### The tbnctl command line interface (CLI)

tbnctl is a CLI for interacting with the Turbine Labs public API, and is used
throughout this guide to set up tbnproxy. Install tbnctl with these commands
(Requires [installation of Go](https://golang.org/dl/), and that `$GOPATH/bin`
is in your `$PATH`):

```console
$ go get -u github.com/turbinelabs/tbnctl
$ go install github.com/turbinelabs/tbnctl
```

In most cases you can also `curl` the api directly, though this is typically
less convenient.

## Creating a Zone

The highest-level unit of organization in the Turbine Labs API is a zone. We'll
use the zone "testbed" in this guide, but you can substitute your own if you've
already created one. To create the testbed zone, run

```console
$ tbnctl init-zone testbed
```

You should now be able to see your zone by running

```console
$ tbnctl list zone
```

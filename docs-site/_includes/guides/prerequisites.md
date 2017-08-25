## Prerequisites

### A functional {{ include.platform }} install

If you don't have one,
[{{ include.quick_start_name }}]({{ include.quick_start_url }}) is a great
resource to get one set up quickly.

{{ include.install_extra | liquefy | markdownify }}

{% include guides/access_token.md %}

## Create a Zone

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

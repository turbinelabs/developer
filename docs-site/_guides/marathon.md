---
layout: page
title: Marathon Guide
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

[//]: # (Integrating Houston with Marathon)

## Follow the [configuration guide]({{ "/reference#configuration" | relative_url }})
This will ensure your API key, domain, zone, routes, and other key components
are set up correctly.

## Configuring tbncollect
In order to install tbncollect you can either configure the application using
the GUI in Marathon to fill in each section of the setup, or drop the following
JSON file into the JSON section:

Be sure to fill in *your api key*, and *your zone name* (found by querying
with: `curl -s -H "X-Turbine-API-Key: <your api key>" https://api.turbinelabs.io/v1.0/zone`).

Here is an [example configuration file for tbncollect](examples/marathon/tbncollect_spec.json):

```javascript
{% include_relative examples/marathon/tbncollect_spec.json %}
```

You can also deploy the app via the command line with:

```shell
dcos marathon app add https://docs.turbinelabs.io/guides/examples/marathon/tbncollect_example.json
```

## Deploying the Demo App
In order for your application to be seen by tbncollect you will need to add it
to an Application Group in Marathon. Create a JSON file (<your group>.json)

Be sure to fill in *your group*, *your app*, and *your cluster name* (found by
querying with: `curl -s -H "X-Turbine-API-Key: <your api key>" https://api.turbinelabs.io/v1.0/cluster`).**

[Example demo app configuration JSON](examples/marathon/app_spec.json):

```javascript
{% include_relative examples/marathon/app_spec.json %}
```

Then, load your new Application Group and Application into Marathon with this
command:

```shell
dcos marathon group add > <your group>.json
```

### Verifying Deployment
Once it deploys, you should be able to curl to see the instance being picked up
by the collector:

```shell
curl -s -H "X-Turbine-API-Key: $TBN_API_KEY" https://api.turbinelabs.io/v1.0/cluster/<your cluster key>
```

*Example Response*

```javascript
{
  {
    "cluster_key":"<your cluster key>",
    "zone_key":"<your zone key>",
    "name":"<your zone name>",
    "instances":
    [
      {
        "host":"123.456.78.90",
        "port":8080,
        "metadata":
        [
          {
            "key":"HAPROXY_GROUP",
            "value":"external,internal"
          },
          {"key":
            "app/id","value": "/<your group>/<your app>"
          },
          {
            "key":"app/required_cpus",
            "value":"0.100"
          },
          {
            "key":"app/required_disk",
            "value":"0.000"
          },
          {
            "key":"app/required_mem",
            "value":"64.000"
          },
          {
            "key":"app/version",
            "value":"2016-00-28T20:55:55.193Z"
          }
        ]
      }
    ],
    "deleted_at":null,
    "checksum":"<checksum value>"
  }
}%
```

## Configuring and deploying tbnproxy
With tbncollect running, you can move on to configuring and deploying tbnproxy.
Use your preferred method of loading apps to deploy the app with the following
JSON file.

Be sure to fill in *your api key*, *your zone name*, which found by querying
with:

```shell
curl -s -H "X-Turbine-API-Key: $TBN_API_KEY" https://api.turbinelabs.io/v1.0/zone
```

and <your proxy name> found by querying with:

```shell
curl -s -H "X-Turbine-API-Key: $TBN_API_KEY" https://api.turbinelabs.io/v1.0/proxy
```

This [example tbnproxy JSON](examples/marathon/tbnproxy_spec.json) should help you get started:

```javascript
{% include_relative examples/marathon/tbnproxy_spec.json %}
```

## Adding a new app to your group
Modify your group's JSON file to add another version of your app, and then
update your Application Group with this command:

```shell
dcos marathon group update <your group> < https://docs.turbinelabs.io/guides/examples/marathon/group_spec.json
```

Finally, here is an [example of your group.json](examples/group_spec.json)""

```javascript
{% include_relative examples/marathon/tbnproxy_spec.json %}
```

You can now view your services through curl:

```shell
curl <ip address> -H "Host: <my.example.domain>"
```

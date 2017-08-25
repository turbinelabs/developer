---
layout: page
title: tbnctl Guide
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

[//]: # (Guide to the tbnctl tool)
This guide discusses the `tbnctl` tool, which is used as the primary CLI
interaction method for creating, editing, and removing zones, clusters, etc.,
from the Turbine Labs API. It may, additionally, be used to manage API Access
Tokens associated with your account.

Please use `tbnctl -h` for detailed help from the command line.

## Installation
To install tbnctl, run the following commands, which will get the application,
and install it using Go:

```console
$ go get -u github.com/turbinelabs/tbnctl
$ go install github.com/turbinelabs/tbnctl
```

## Authentication with `tbnctl`

For `tbnctl` to have authorization to make requests to the Turbine Labs API it
must have access to valid credentials. These may be provided by specifying an
Access Token in the `-api.key` flag or by logging in with your username and
password.

### login

`tbnctl login` prompts you for a username and password and locally stores
session info good for 24 hours. Once this has been done any other commands
will automatically be authorized.

_**Note:** in-terminal password input is not functional on Windows but a password
may be specified as a flag to `login`. See `tbnctl login -h` for details._

### logout

`tbnctl logout` clears any cached sessions.

### Access Token Management

These commands are used to manage Access Tokens that are associated with the
authorized account. An Access Token is a revokeable key that can be used to
authenticate with the Turbine Labs API.

In order to use an Access Token it may be passed in any place that uses an
"API key." Most often this is associated with the `-api.key` flag on a
command or in the `TBNCTL_API_KEY`, `TBNCOLLECT_API_KEY`, and `TBNPROXY_API_KEY`
environment variables.

#### access-tokens add &lt;comment&gt;

This will add a new token with the specified comment. The comment should be a
short (<255 characters) description of what the token will be used for and is
required.

When a token is created it will be presented as a JSON object:

```console
$ tbnctl access-tokens add 'token creation demonstration'
```
```json
{
  "access_token_key": "<access_token_key>",
  "description":      "token creation demonstration",
  "signed_token":     "<base64-encoded-string>",
  "user_key":         "<user_key>",
  "created_at":       "2017-08-25T15:45:24.373902712Z",
  "checksum":         "d5b02686-da3f-4626-47c5-71c1ad496960"
}
```

The most important attributes in this object are the `access_token_key` and the
`signed_token`. The `access_token_key` is used to reference the Access Token when
deleting and the `signed_token` is what should be passed to `api.key` flag (or
corresponding environment variables) to authenticate your request.

Note that this is the only time you will be able to see `signed_token`.

#### access-tokens list

This lists all active Access Tokens associated with your account. Note that
an Access Token retrieved in this way will not include a `signed_token`
attribute.

#### access-tokens remove &lt;access\_token\_key&gt;

Removing an Access Token means that it may no longer be used to authenticate
API requests.

## Object Management Commands

Each command can be used with one of the following objects: user, zone, proxy,
domain, route, shared\_rules, or cluster.

These commands must have a means of authentication available. Either a cached
session established via `tbnctl login` or an Access Token&mdash;either passed
as `-api.key` or `TBNCTL_API_KEY`&mdash;is acceptable.

### list

This gets a list of resources, e.g. `tbnctl list zones`. Equivalent to
`GET <api>/v1.0/<object type>`. This includes the options of
`format=string (<format name>` or `<format string>`). Some pre-defined format
strings may be referenced by name.

The flag `name` will override the more general json/yaml format flag. If a
custom format is desired, it may be specified by prefixing the string with '+'.
The available pre-defined formats vary based on the object type being listed,
e.g. cluster, or zone. For the full list of objects, use `tbnctl list -h`.

A simple filter may be applied to the results by providing a list of constraints.
A constraint is in the format of `<attribute>=<value>` and the available
attributes vary by object type. In order to see what may be used as part of a
filter `tbnctl list --show-filter-fields <object type>`.

```console
$ tbnctl list --show-filter-fields domain
```
```shell
Listing results may be filtered by setting attributes of a service.DomainFilter

The filterable attribute names and their types:
    NAME        TYPE
    domain_key  string
    name        string
    zone_key    string
    org_key     string
```

```console
$ tbnctl list domain name=api.example.com
```
```json
[
  {
    "domain_key": "<domain_key>",
    "zone_key": "<zone_key>",
    "name": "api.example.com",
    "port": 80,
    ...
  },
  {
    "domain_key": "<domain_key_2>",
    "zone_key": "<zone_key>",
    "name": "api.example.com",
    "port": 443,
    ...
  }
]
```

### create

This creates a new resource from a file/flags, e.g. `cat zone.json | tbnctl
create zone`. Equivalent to `POST <api>/v1.0/<object type>`. STDIN is used to
provide the JSON file through the use of pipes. For more detailed help, please
type `tbnctl create -h`.

### edit

This modifies a resource, e.g. tbnctl edit zone testbed. Equivalent to
`PUT <api>/v1.0/<object type>/<object id>`. When changes need to be made an
initial version of the object can be presented in an editor. The command used
to launch the editor is taken from EDITOR and must block execution until the
updated object and the editor is closed. For scripting purposes it may be
useful to use STDIN to provide the edited object instead of using an
interactive editor. If so, simply make the new version available on STDIN
through standard use of pipes. For more detailed help, please type
`tbnctl edit -h`.


### delete

This deletes a single resource, e.g. tbnctl delete zone testbed, and is
equivalent to `DELETE <api>/v1.0/<object type>/<object id>`. For more detailed
help, please type `tbnctl delete -h`.


### init-zone

This initializes a named Zone in the Turbine Labs API, adding zero or more
default routes for pairs of domain/port and cluster names, and zero or more
proxies serving one or more domains each.

Port/domain pairs are specified with `proxy=domain:port,...`, while Routes are
specified with `domain:port[/path]=cluster([:key=value]*),...`. For more
detailed help, please type `tbnctl init-zone -h`.

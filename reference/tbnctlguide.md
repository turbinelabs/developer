
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
interaction method for creating, editing, and removing zones, clusters, etc,
from the Turbine Labs API.

Please use `tbnctl -h` for detailed help from the command line.

## Installation
To install tbnctl, run the following commands, which will get the application, and install it using Go:

```shell
go get -u github.com/turbinelabs/tbnctl
go install github.com/turbinelabs/tbnctl
```

## List of commands

Each command can be used with one of the following objects: user, zone, proxy,
domain, route, shared_rules, or cluster. For each command, you will need to
include `--api.key` at a minimum.

- list: gets a list of resources, e.g. `tbnctl list zones`. Equivalent to `GET <api>/v1.0/<object type>`. Option: format=string (<format name> or <format string>). Some pre-defined format strings may be referenced by name.
  - name: if set this will override the more general json/yaml format flag. If
  a custom format is desired, it may be specified by prefixing the string with
  '+'. The available pre-defined formats vary based on the object type being
  listed, e.g. cluster, or zone. For the full list of objects, use `tbnctl list -h`.

- create: create a new resource from a file/flags, e.g. `cat zone.json | tbnctl
create zone`. Equivalent to `POST <api>/v1.0/<object type>`. STDIN is used to
provide the JSON file through the use of pipes.

- edit: modify a resource, e.g. tbnctl edit zone testbed. Equivalent to `PUT <api>/v1.0/<object type>/<object id>`. When changes need to be made an initial
version of the object can be presented in an editor. The command used to launch
the editor is taken from EDITOR and must block execution until the updated
object and the editor is closed. For scripting purposes it may be useful to use
STDIN to provide the edited object instead of using an interactive editor. If
so, simply make the new version available on STDIN through standard use of
pipes.

- delete: deletes a single resource, e.g. tbnctl delete zone testbed.
Equivalent to `DELETE <api>/v1.0/<object type>/<object id>`.

- proxy-config: Get the proxy config.

- tbnctl -h <cmd>: Shows command details and command environmental variables.

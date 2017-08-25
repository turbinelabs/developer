---
layout: page
title: Application Usage Guide
print_order: 6
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

[//]: # ( Turbine Labs App Guide                                              )

This guide explains the features, knobs, and buttons for the Houston web app.
With Houston, you can test and release new software incrementally to customers,
compare the customer experience across software versions, and measure the
quality and pace of iteration.

## Dashboard

The dashboard show a top-line chart of the currently parented object (initially
the Zone), a list of changes to that object, and sparkline charts for other
related objects.

Return to this page at any time by clicking the Turbine Labs logo on the top
left of the screen. Clicking on the pencil next to a Release Group will take
you to the Release Group Editor (see [Editing Release Groups](#releasegroups)
below)

### View Layout

Each dashboard view includes a top-line set of charts showing the aggregate
data from the currently selected Zone, Domain, Service, Release Group, or
Route. Below, charts are displayed for relevant related objects. These charts
all share a common x-axis. Each sparkline can be expanded to a larger inline
chart view, or can be made the new top-line view.

The default view is of a Zone, from which you can see sparklines for the
underlying Domains, Services, and Release Groups. From Zone, you can explore
the routing and release objects recursively, or choose one from the dropdown to
the right of your selected Zone. The chart below summarizes the different
sparkline row types available for each top-line view:

**The following chart shows the relationship between views, and charts**

Views         | Sparklines
--------------|------------------------------------
Zone          | Domains / Release Groups / Services
Domain        | Routes / Release Groups / Services
Release Group | Routes / Services
Route         | Services
Service       | Instances / Release Groups / Routes

### Charts

#### Latency

Displays the 50th and 99th percentile latencies, in milliseconds, of the
currently selected Zone, Domain, Service, Route, or Release Group.

#### Requests

Displays requests, successes, errors, and failures for the currently selected
Zone, Domain, Service, Route, or Release Group.

#### Success Rate

Displays the percentage of requests that were successful for the currently
selected Zone, Domain, Service, Route, or Release Group.

### Zones

The Zone showing in the top bar is the currently selected Zone. Clicking on it
will show any other available Zones.

### Time Filter

This filters the time period for the charts. Choose from the past hour, the
past day, the past week, or a custom time period.

### Changelog

All recent changes within the current view appear here. For example, in a Zone
view, all changes to Routes, Release Groups, and Services would be present.

### More Menu

#### Add Route

This option displays a screen allowing you to choose the Domain, path, and
Release Group for your new Route. Once the new Route is created, you can add
additional rules to it.

#### Delete Route

Remove an existing Route and its rules. A dialog will appear, showing which
Services are currently being Routed to _Caution, this is irreversible once you
confim by clicking Delete_

#### Add Domain

Add a new Domain, comprising a hostname and port. You can also map this Domain
to one or more Proxies.

#### Add Proxy

Add a new Proxy, which represents the configuration of one or more tbnproxy
instances. You can choose which Domains to make the Proxy available to from a
list of Domains on your Zone.

### User Menu

#### Log out

Click to return to the login screen, after logging your user out of the app.

### Editing Release Groups <a name="releasegroups"></a>

With your Release Group selected, click the pencil to invoke edit mode. You
will see the following:

  - Related Routes: Routes that are currently part of the selected Release
  Group.
  - Default Behavior: Set the destination and the default routing behavior for
  traffic to any Route within this Release Group. Set the weight, and the
  Service affected.
  - Request Specific Overrides: Select methods (GET, POST, etc), the property
  to match (cookie, header, or query), name, value, weight, and Service, along
  with constraint keys for this Release Group.

#### Undo

Click to undo any unsaved changes to your Release Group.

#### More

This allows you to do the following:

  - View Charts: This exits the Release Group editor, and returns you to the
  charts and metrics dashboard.
  - Clone `<Release Group name>`: This clones the selected Release Group.
  Group to easily keep complex changes and build off of existing Release Groups.
  - Delete `<Release Group name>`: This deletes the selected Release Group.
  **Note** *This is irreversible, so use carefully*
  - View Debug Info: Displays information about your current environment,
  useful for debugging with Turbine Labs developers.

#### Save changes to `<Release Group name>`

This button saves your current edits and changes. It will be greyed-out if no
changes were made since last save.

---

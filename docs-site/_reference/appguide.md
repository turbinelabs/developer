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

## Releases

A list of counts of software versions currently being tested, released, or
which are available for test or release.

## Settings

### Edit Routes

Click to go the Route Editor, which allows you to view and edit current Routes
for your Services.

### Debug Info

Displays information about your current environment, useful for debugging with
Turbine Labs developers

## Zones

The Zone showing in the top bar is the currently selected Zone. Clicking on it
will show any other available Zones.

## User

### Log out

Click to return to the login screen, after logging your user out of the app.

## View Layout

Each view in the app includes a top-line set of charts showing the aggregate
data from the currently selected Zone, Domain, Service, Release Group, or
Route. Below, "sparklines" rows are displayed for relevant sub-objects. These
charts all share a common x-axis. Each sparkline can be expanded to a larger
inline chart view, or can be made the new top-line view.

The default view is of a Zone, from which you can see sparklines for the
underlying Domains, Services, and Release Groups. The chart below summarizes
the different sparkline row types available for each top-line view:

**The following chart shows the relationship between views, and sparklines**

Views         | Sparklines
--------------|------------------------------------
Zone          | Domains / Release Groups / Services
Domain        | Routes / Release Groups / Services
Release Group | Routes / Services
Route         | Services
Service       | Instances / Release Groups / Routes

## Charts

### Latency

Displays the 50th and 99th percentile latencies, in milliseconds, of the
currently selected Zone, Domain, Service, Route, or Release Group.

### Requests

Displays requests, successes, errors, and failures for the currently selected
Zone, Domain, Service, Route, or Release Group.

### Success Rate

Displays the percentage of requests that were successful for the currently
selected Zone, Domain, Service, Route, or Release Group.

### Time Filter

This filters the time period for the charts. Choose from the past hour, the
past day, the past week, or a custom time period.

## Changelog

All recent changes within the current view appear here. For example, in a Zone
view, all changes to Routes, Release Groups, and Services would be present.

## Edit Routes

### Route list

Each item in the dropdown list represents a Route serving live traffic. Select
a Route to display existing rules for that Route.

### Add rule

This adds a new rule to the selected Route. **This change applies to all Routes
within the Release Group.** Choose Save Release Group to apply your change.

### More

#### Create Route

This option displays a screen allowing you to choose the Domain, path, and
Release Group for your new Route. Once the new Route is created, you can add
additional rules to it.

#### Delete Route

Remove an existing Route and its rules. A dialog will appear, showing which
services are currently being routed to _Caution, this is irreversible once you
confim by clicking Delete_

#### Add Domain

Add a new Domain, comprising a hostname and port. You can also map this Domain
to one or more Proxies.

#### Add Proxy

Add a new Proxy, which represents the configuration of one or more tbnproxy
instances. You can choose which Domains to make the Proxy available to from a
list of Domains on your Zone.

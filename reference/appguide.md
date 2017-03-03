
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

This guide explains the features, knobs, and buttons for the Houston web UI application. When using Houston, this web app let's you setup new releases, edit custom routes, monitor your site and applications, and view a robust changelog. Visit [our app](app.turbinelabs.io) to see more.

## Releases
A list of counts of software versions currently being tested, released, or
which are available for test or release.

## Settings
### Edit Routes
Click to go the Route Editor, which allows you to view and edit current routes
for your services.
### Debug Info
Displays information about your current environment, useful for debugging with
Turbine Labs developers
## Zones
The zone showing in the top bar is the currently selected zone. Clicking on it
will show any other available zones.

## User
### Log out
Click to return to the login screen, after logging your user out of the app.

## View Layout
Each view in the app includes a top-line set of charts showing the aggregate
data from the currently selected zone, domain, service, release group, or
route. Below, "sparklines" rows are displayed for relevant sub-objects. These
charts all share a common x-axis. Each sparkline can be expanded to a larger
inline chart view, or can be made the new top-line view.

The default view is of a Zone, from which you can see sparklines for the
underlying Domains, Services, and Release groups. The chart below summarizes
the different sparkline row types available for each top-line view:

**The following chart shows the relationship between views, and sparklines**

| Views         | Sparklines                          |
|---------------|-------------------------------------|
| Zone          | Domains / Release Groups / Services |
| Domain        | Routes / Release Groups / Services  |
| Release Group | Routes / Services                   |
| Route         | Services                            |
| Service       | Instances / Release Groups / Routes |


## Charts
### Latency
Displays the 50th and 99th percentile latencies, in milliseconds, of the
currently selected zone, domain, service, route, or release group.
### Requests
Displays requests, successes, errors, and failures for the currently selected
zone, domain, service, route, or release group.
### Success Rate
Displays the percentage of requests that were successful for the currently
selected zone, domain, service, route, or release group.


### Time Filter
This filters the time period for the charts. Choose from the past hour, the
past day, the past week, or a custom time period.
### Compare
_Not Currently Implemented_ Each chart can show comparison data for versions or
stages of your services or applications.

## Changelog
All recent changes within the current view appear here. For example, in a Zone
view, all changes to Routes, Release Groups, and Services would be present.
### More
_Not Currently Implemented_ This menu allows you to view the metric data in
another service, download for use elsewhere, or share it with another team or
coworker.

## Edit Routes
### Route list
Each item in the dropdown list represents a route serving live traffic. Select
a route to display existing rules for that route.
### Add rule
This adds a new rule to the selected route. **This change applies to all Routes
within the Release Group.** Choose Save Release Group to apply your change.
### More
#### Create Route
This option displays a screen allowing you to choose the domain, path, and
release group for your new route. Once the new route is created, you can add
addition rules for it.
#### Split Route
_Not Currently Implemented_
#### Clone Route
_Not Currently Implemented_ Copy an existing route, with all of its rules.
#### Delete Route
_Not Currently Implemented_ Remove an existing route and its rules. _Caution,
this is irreversible once you click Save Release Group_

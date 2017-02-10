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

[//]: # (Quick Start)

This guide walks you through setting up, and using an all-in-one example app, as
well as a few exercises to illustrate what Houston and the Turbine Labs API can
accomplish.

## Signing up for an account

To get started with Houston, you'll need a Turbine Labs
account. Email[support@turbinelabs.io](mailto:support@turbinelabs.io) and we'll
create one for you.

## What's in the All-In-One image?

### Houston
These two applications will run in a real-world deployment, connected to Turbine Labs' API.

- **tbnproxy**: The Turbine Labs reverse proxy as well as an admin agent that
maintains proxy
  configuration and sends metrics to the Turbine Labs Service.

- **tbncollect**: A service discovery agent that observes the service instances,
  updating the Turbine Labs Service as services or applications come and go.
  In this demo, the collector is watching for files instead of API instances.

### Demo server
A simple HTTP server application that returns hex color value strings. There
are three "versions" of the server, each returning a different color value:
  - blue
  - green
  - yellow

### Demo app
This app is used to demo the use of Houston through a simple
visualization of routing and responses, but is disposable after experimenting
with this demo.

## Starting the all-in-one example
The three environment variables you'll need to set in order to run the demo are:

- `TBNPROXY_API_KEY` - the Turbine Labs API key to use
- `TBNPROXY_API_ZONE_NAME` - the zone name to use for the trial
- `TBNPROXY_PROXY_NAME` - the name of the proxy, usually the zone name with a
  "-proxy" suffix

To run the Docker container with tbnproxy, tbncollect, a demo app, and the
associated NGINX hosts, use the following command:

```shell
docker run -p 80:80 \
  -e "TBNPROXY_API_KEY=$TBN_API_KEY" \
  -e "TBNPROXY_API_ZONE_NAME=local-demo" \
  -e "TBNPROXY_PROXY_NAME=local-demo-proxy" \
  turbinelabs/all-in-one:latest
```

This command will:

- Pull the Turbine Labs all-in-one image from Docker Hub if you don't already
have it.
- Initialize your test zone if it doesn't already exist.
- Launch tbnproxy.
- Launch tbncollect.
- Launch the three demo app instances.

> Note: In some cases the local Docker time may have drifted significantly
> from your host's time. If this is the case, you'll see the following message
in the
> `docker run` output:
> ```FATAL: your docker system clock differs from actual (google) time by more
than a minute.
     This will cause stats and charts to behave strangely.```
>
> If you see this error, restart Docker and re-run the all-in-one container.

## Demo exercises

### What's going on here?

With the all-in-one container running, you should be able to navigate to
[localhost](http://localhost/)* to view the demo app. The demo provides
a UI and a set of services that help visualize changes in the mapping of user
requests to backend services. The application is composed of three sets of
blocks, each simulating a user making a request. These are simple users, and
they all repeat the same request forever. The services they call return a color.
When a user receives a response it paints the box that color, then waits a
random amount of time to make another request. While it’s waiting the colors in
the box fade. Users are organized into rows based on URL.

* On older versions of Docker for Mac, and on Windows < 10, you'll access the
result of invoking `docker-machine ip` (with a standard value of
`192.168.99.100`) rather than `localhost`

<img height="50%" width="50%" src="https://d16co4vs2i1241.cloudfront.net/uploads/tutorial_image/file/684824296811398630/85fd3f987358bbbf866ace1ac6193f07fb5788a4302291a8e29c3eef7ac8c973/column_sized_Screen_Shot_2017-01-26_at_9.40.43_PM.png"/>

The colors indicate the following:

- Blue: a production service
- Green: another production service
- Yellow: a dev service

You should see pulsating blue boxes for each service, to indicate the initial
state of your production services. The green and yellow services are deployed,
but aren't released, so they won’t appear in this view yet.

### Deployed State

Let’s dig deeper into how tbnproxy routes traffic. Traffic is received by a
proxy that handles traffic for a given domain. The proxy maps requests to
service instances via routes and rules. Routes let you split your domain into
manageable segments, for example `/bar` and `/baz`. Rules let you map requests
to a constrained set of service instances in clusters, for example “by default
send traffic to servers tagged with a key-value mapping of stage=production”.
Clusters contain sets of service instances, each of which can be tagged with
key/value pairs to provide more information to the routing engine.

Your environment should look like the following

![Prismatic Setup](https://d16co4vs2i1241.cloudfront.net/uploads/tutorial_image/file/636842997144618507/0d8f89bd404654ad9ce3e35ee9d38960dd34c35661e89fcb561b6ae20e422283/column_sized_prismatic-setup.png)

There is a single domain (`local-demo:80`) that contains two routes. `/api`
handles requests to our demo service instances, and `/` handles
requests for everything else (in this case the demo app). There are
two clusters. Local-demo-api-cluster has 3 instances, each tagged with a
different version (represented as a color). The blue and green instances are
also tagged `stage=prod`. The local-demo-cluster has a single instance
tagged prod.

The rules currently only map traffic to instances tagged
`stage=prod,version=blue`, which is why only blue is showing. If we were to map
instead to `stage=prod`, both blue and green instances would match, and tbnproxy
would load balance across them. In this case you'd see an even split of blue and
green.

### Browser overrides

Let’s test our green dev version before we release it to customers. tbnproxy
allows you to route to service instances based on headers set in the request.
Navigate to [app.turbinelabs.io](https://app.turbinelabs.io), log in and select
the zone you’re working with (local-demo by default). Click settings -> edit
routes, and select local-demo:80/api from the top left dropdown. You should see
the following screen

![Screen Shot 2016 10 25 At 4.20.38 Pm](https://d16co4vs2i1241.cloudfront.net/uploads/tutorial_image/file/619232397325502423/3209a51a0840a6940c6141a8191722f231be1c8590ed02e9eda86f9fc42e3f55/column_sized_Screen_Shot_2016-10-25_at_4.20.38_PM.png)

Click “Add Rule” from the top right, and enter the following values.

![Screen Shot 2016 11 21 At 4.39.55 Pm](https://d16co4vs2i1241.cloudfront.net/uploads/tutorial_image/file/636837738787636740/ddf7276864c3f6be8f29f042b7d320f4ac71708b1d5ed4f7c0e7dbcaedcb6c43/column_sized_Screen_Shot_2016-11-21_at_4.39.55_PM.png)

This tells the proxy to look for a header called `X-TBN-Version`. If the proxy
finds that header, it uses the value to find servers in the local-demo-api-
cluster that have a matching version tag. For example, setting `X-TBN-Version:
blue` on a request would match blue production servers, and `X-TBN-Version: green` would match green dev servers.

The demo app converts a `X-TBN-Version` query parameter into a
header in calls to the backend; if you navigate to [localhost?X-TBN-
Version=yellow](http://localhost?X-TBN- Version=yellow) you should see all
yellow boxes. Meanwhile going to [localhost](http://localhost) without that
parameter still shows blue.

<img src="https://d16co4vs2i1241.cloudfront.net/uploads/tutorial_image/file/619233248442058713/9e580867275ee1a7fd6b502c8b5c8e6fbc24ea8ec31759ac5b2326ea7fdc264c/column_sized_Screen_Shot_2016-10-28_at_10.43.02_AM.png" height="50%" width="50%"/>

This technique is extremely powerful. New software was tested in
production without customers being affected. You were able to test the new
software on the live site before releasing to customers. In a real world
scenario your testers can perform validation, you can load test, and you can
demo to stakeholders without running through a complicated multi-environment
scenario.

### Testing latency and error rates

In order to demo what errors and latency issues may look like in a production environment, we implemented a few parameters that can be set to illustrate these scenarios. By default, each of the demo servers returns a successful (status code 200) response with its color (as a hex string) as the response body.

URL parameters passed to the web page at http://localhost can be used to control the mean latency and error rate of each of the different server colors.

#### Parameter effect
- x-color-delay
  Sets the mean delay in milliseconds.
- x-color-error
  Sets the error rate, describe as a fraction of 1 (e.g., 0.5 causes an error 50% of the time).

The latency and error rates are passed to the demo servers as HTTP headers with the same name and value as the URL parameters described.

### Incremental release

If you navigate to [localhost?X-TBN-Version=green](http://localhost?X-TBN-
Version=green), you can verify that the green "production" version works too.
Now we're ready to do an incremental release from blue to green. Right now the
default rules for `/api` send all traffic to blue. Let’s introduce a small
percentage of green traffic to customers.

Navigate to [app.turbinelabs.io](https://app.turbinelabs.io), then click
"Release Groups" below the top-line charts. The row "local-demo-api-cluster "
should be marked "RELEASE READY". Click anywhere in the row to expand it, then
click "release".

<img src="https://d16co4vs2i1241.cloudfront.net/uploads/tutorial_image/file/684826314011575784/885556999d2fcb7e44ea4ecd2210f8e0f57227d0683b581d15f5103195e9d91e/column_sized_Screen_Shot_2017-01-26_at_9.44.35_PM.png" height="100%" width="100%"/>

Let's send 25% of traffic to our new green version by either
moving the slider or typing "25" in the text box. The Release Group should now
be marked "RELEASING".

![Screen Shot 2017 01 26 At 9.48.28 Pm](https://d16co4vs2i1241.cloudfront.net/uploads/tutorial_image/file/684828276752909802/f33f12bdbbfc7ec76f36f51cbbfaa6ea4ed2acc8bb4a961363bdbe2003ec483c/column_sized_Screen_Shot_2017-01-26_at_9.48.28_PM.png)

[localhost](http://localhost) should now show a mix of blue and green. You can
increment the green percentage as you like. When you get to 100%, the release
is complete.

<img src="https://d16co4vs2i1241.cloudfront.net/uploads/tutorial_image/file/684828961254933996/b030e8b9bbcbe04c615c87a327bebe7525ec97c4b82e71be357e71efe28a9b16/column_sized_Screen_Shot_2017-01-26_at_9.49.37_PM.png" width="50%" height="50%"/>

Congratulations! You've safely and incrementally released a new version of your
production software. Both blue and green versions are still running; if a
problem were found with green, a rollback to blue would be just as easy.

## Next steps

Now that you've seen demo app in action, you can move on to deploying Houston in your own environment. After reading the configuration guide below, proceed to
one of the following cloud integrations:

 - [Kubernetes](https://docs.turbinelabs.io/guides/deploying-the-turbine-labs-product-suite-to-kubernetes)

 - [Marathon](https://docs.turbinelabs.io/guides/deploying-the-turbine-labs-product-suite-to-marathon)

 - [Docker on EC2](https://docs.turbinelabs.io/guides/deploying-the-turbine-labs-product-suite-to-docker-on-ec2)

 - [ECS](https://docs.turbinelabs.io/guides/deploying-the-turbine-labs-product-suite-to-ecs)

 - [Consul](https://docs.turbinelabs.io/guides/deploying-the-turbine-labs-product-suite-to-consul)

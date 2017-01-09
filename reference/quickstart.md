
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

This guide walks you through setting up, and using an all-in-one example app, as well as a few exercises to illustrate what Turbine Labs' App and Service can accomplish.

## Signing up for an account
To get started with Turbine Labs' App and Service, you'll need an account. Email [support@turbinelabs.io](mailto:support@turbinelabs.io) and we'll get you set up with an account.
You will also need a [DockerHub](https://hub.docker.com) account in order to run the app.

## Getting access to the container
Currently the all-in-one container is not a public Docker image. To get access, you'll need to:
  * Create a DockerHub account.
  * Send an email to support@turbinelabs.io requesting access for your DockerHub account.
  * Make sure you're logged in with the appropriate credentials by running `docker login` from the command line.

## What's in the box?
- tbnproxy: the proxy itself as well as an admin agent that maintains proxy configuration and sends metrics to the Turbine Labs Service.
- tbncollect: a service discovery agent that observes the service instances, updating the Turbine Labs Service as services or applications come and go. In this demo, the collector is watching for files instead of API instances.
- Prismatic Spray: a simple HTTP server application that returns hex color value strings. There are three "versions" of the server, each returning a different color value:
  - yellow
  - blue
  - green

## Using the example app
The three variables you will need in order to run the demo are:
- TBNPROXY_API_KEY - the Turbine Labs API key to use
- TBNPROXY_API_ZONE_NAME - the zone name to use for the trial
- TBNPROXY_PROXY_NAME - the name of the proxy, usually the zone name with a "-proxy" suffix

To run the Docker container with tbnproxy, tbncollect, Prismatic Spray, and the associate NGINX hosts, use the following command:

```shell
docker run -p 80:80 -e "TBNPROXY_API_KEY=$TBN_API_KEY" -e "TBNPROXY_API_ZONE_NAME=local-demo" -e "TBNPROXY_PROXY_NAME=local-demo-proxy" turbinelabs/all-in-one:latest
```

The Docker image should pull from our repository, run, and then initialize your zone, domain, etc. Note that in some instances, notably when running on a Mac, the container's time may drift significantly from reality. In this case you may need to restart the Docker host VM to ensure stats are reported appropriately. The all-in-one container's startup script will warn you about this case and exit if time has drifted.

## Prismatic Spray Exercises

### What's Going on Here?
With the all-in-one container running, you should be able to navigate to [localhost](http://localhost/) to view the Prismatic Spray UI. Prismatic Spray is a UI and set of services that helps visualize changes in the mapping of user requests to backend services. The application is composed of three sets of blocks, each representing a user making a request. These are simple users, and they all repeat the same request forever. The services they call return a color. When a user receives a response it paints the box that color, then waits a random amount of time to make another request. While it’s waiting the colors in the box fade. We organize users into rows based on which request they’re making. In this screen we see users asking for foo, bar, and baz.

![Prismatic Start](https://d16co4vs2i1241.cloudfront.net/uploads/tutorial_image/file/619225423221360579/141cb63de4cf2c9fc602d92cdbd7cd47224d2d159f7312fad1f30f3e306dcaa8/column_sized_prismatic-start.png)

The colors indicate the following:
  - Yellow: a production service
  - Blue: another production service
  - Green: a dev service

You should see pulsating blue and yellow boxes for each service, to indicate your production services. The green dev service is deployed, but isn’t released, so it doesn’t appear in this view yet.

### Deployed State
Let’s dig deeper into how tbnproxy routes traffic. Traffic is received by a proxy that handles traffic for a given domain. The proxy maps requests to service instances via routes and rules. Routes let you split your domain into manageable segments, for example /bar and /baz. Rules let you map requests to a constrained set of service instances in clusters, for example “by default send traffic to servers tagged with a key-value mapping of stage=production”. Clusters contain sets of service instances, each of which can be tagged with key/value pairs to provide more information to the routing engine.

Your environment should look like the following

![Prismatic Setup](https://d16co4vs2i1241.cloudfront.net/uploads/tutorial_image/file/636842997144618507/0d8f89bd404654ad9ce3e35ee9d38960dd34c35661e89fcb561b6ae20e422283/column_sized_prismatic-setup.png)

There is a single domain (local-demo:80) that contains two routes. /api handles requests to our Prismatic Spray service instances, and / handles requests for everything else (in this case the Prismatic Spray UI). There are two clusters. Local-demo-api-cluster has 3 instances, each tagged with a different color. The blue and yellow instances are also tagged prod. The local-demo-ui-cluster has a single instance tagged prod.

The rules currently only map traffic to instances tagged prod, which is why only blue and yellow services are showing. When multiple instances match a rule’s constraints tbnproxy will load balance across them. This is why we end up with half blue/half yellow in the Prismatic Spray UI.

### Browser Overrides

Let’s test our green dev version before we release it to customers. tbnproxy allows you to route to service instances based on headers set in the request. Navigate to https://app.turbinelabs.io, log in and select the zone you’re working with (local-demo by default). Click settings -> edit routes, and select local-demo:80/api from the top left dropdown. You should see the following screen

![Screen Shot 2016 10 25 At 4.20.38 Pm](https://d16co4vs2i1241.cloudfront.net/uploads/tutorial_image/file/619232397325502423/3209a51a0840a6940c6141a8191722f231be1c8590ed02e9eda86f9fc42e3f55/column_sized_Screen_Shot_2016-10-25_at_4.20.38_PM.png)

Click “Add Rule” from the top right, and enter the following values.
![Screen Shot 2016 11 21 At 4.39.55 Pm](https://d16co4vs2i1241.cloudfront.net/uploads/tutorial_image/file/636837738787636740/ddf7276864c3f6be8f29f042b7d320f4ac71708b1d5ed4f7c0e7dbcaedcb6c43/column_sized_Screen_Shot_2016-11-21_at_4.39.55_PM.png)

This tells the proxy to look for a header called X-TBN-Version. If the proxy finds that header, it uses the value to find servers in the local-demo-api-cluster that have a matching version tag. For example, setting “X-TBN-Version: blue on a request would match blue production servers, and “X-TBN-Version: green matches green dev servers.

Now if you navigate to [localhost?X-TBN-Version=green](http://localhost?X-TBN-Version=green) you should see all green boxes, because the Prismatic Spray UI converts URL parameters to headers on API requests. Meanwhile going to [localhost](http://localhost) still shows the blue/yellow mix.

![Screen Shot 2016 10 28 At 10.43.02 Am](https://d16co4vs2i1241.cloudfront.net/uploads/tutorial_image/file/619233248442058713/9e580867275ee1a7fd6b502c8b5c8e6fbc24ea8ec31759ac5b2326ea7fdc264c/column_sized_Screen_Shot_2016-10-28_at_10.43.02_AM.png)

While simple, this technique is extremely powerful. New software was deployed without customers (the blue/yellow mix) being affected. You were able to test the new software on the live site before releasing to customers. In a real world scenario your testers can perform validation, you can load test, and you can demo to stakeholders without running through a complicated multi-environment scenario.

### Incremental Release
Now that we’ve verified that the green software works, let’s run through an incremental release scenario. Right now the default rules for /api split traffic between blue and yellow. Let’s introduce a small percentage of green traffic to customers. Note that our constraints have weights. Let’s modify the default section of our route (the section contained within “Else…”) to add a new constraint (click the + icon).

![Screen Shot 2016 11 21 At 4.42.00 Pm](https://d16co4vs2i1241.cloudfront.net/uploads/tutorial_image/file/636838686431905288/e80874a715710e7cae3e136d53c5fd971c8efe7157d6edaa58af6e7fdadfc0bd/column_sized_Screen_Shot_2016-11-21_at_4.42.00_PM.png)

Add a constraint of “10 to ‘local-demo-api-cluster’ version = green', and change the weight of the prod constraint to 90. This new rule says with weight 90, send requests to servers marked prod. With weight 10 send requests to servers with a version of dev, which shows up in green. Our weights add up to 100 to keep math easy, so this is a 90%/10% split. Save the route, and look at the prismatic spray GUI. You should have roughly 10% green boxes in the screen.

![Screen Shot 2016 10 28 At 10.44.35 Am](https://d16co4vs2i1241.cloudfront.net/uploads/tutorial_image/file/619234412873123804/aab566668e82b146f1e292e593b23999dfa053c6bd4148f81474c7e84637ba81/column_sized_Screen_Shot_2016-10-28_at_10.44.35_AM.png)

You can change the weight of the green constraint to 100, save the route and see it move to 50%. Finally, you can delete the prod constraint using the “-” icon to move all traffic to the green dev service.

## Before you get started
Email [support@turbinelabs.io](mailto:support@turbinelabs.io) with your [DockerHub](https://hub.docker.com) account, and a [Github](https://www.github.com) account and we'll get you set up with an account.

## Next Steps
Now that you've seen tbnproxy demo app in action, you can move on to deploying it in your environment. After reading the Configuration guide below, proceed to one of the following cloud integrations:

 - [Kubernetes](https://docs.turbinelabs.io/guides/deploying-the-turbine-labs-product-suite-to-kubernetes)

 - [Marathon](https://docs.turbinelabs.io/guides/deploying-the-turbine-labs-product-suite-to-marathon)

 - [Docker on EC2](https://docs.turbinelabs.io/guides/deploying-the-turbine-labs-product-suite-to-docker-on-ec2)

 - [ECS](https://docs.turbinelabs.io/guides/deploying-the-turbine-labs-product-suite-to-ecs)

 - [Consul](https://docs.turbinelabs.io/guides/deploying-the-turbine-labs-product-suite-to-consul)

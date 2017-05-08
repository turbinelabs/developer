### Testing before release

Let’s test our green version before we release it to customers. tbnproxy allows
you to route to service instances based on headers set in the request. Navigate
to [app.turbinelabs.io](https://app.turbinelabs.io), log in and select the zone
you’re working with (testbed by default). Click "Settings" -> "Edit Routes", and
select testbed-domain:80/api from the top left dropdown. You should see the
following screen

Click “Add Rule” from the top right, and enter the following values.

<img
src="https://img.turbinelabs.io/2017-03-17/all-in-one-server-header-rule.png"/>

This tells the proxy to look for a header called `X-TBN-Version`. If the proxy
finds that header, it uses the value to find servers in the all-in-one-client
cluster that have a matching version label. For example, setting `X-TBN-Version:
blue` on a request would match blue servers, and `X-TBN-Version: green` would
match green servers.

The demo app converts a `X-TBN-Version` query parameter into a header in calls
to the backend; if you navigate to `http://<your external IP>?X-TBN-Version=green`
you should see all green boxes. Meanwhile going to `http://<your-client>`
without that parameter still shows blue.

This technique is extremely powerful. New software was previewed in production
without customers being affected. You were able to test the new software on the
live site before releasing to customers. In a real world scenario your testers
can perform validation, you can load test, and you can demo to stakeholders
without running through a complicated multi-environment scenario, even during
another release.

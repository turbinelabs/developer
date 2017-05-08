### Testing latency and error rates

In order to demo what errors and latency issues may look like in a production
environment, we implemented a few parameters that can be set to illustrate these
scenarios. By default, each of the demo servers returns a successful (status
code 200) response with its color (as a hex string) as the response body.

URL parameters passed to the client web page at can be used to control the mean
latency and error rate of each of the different server colors.

#### An example

The following URL will show an error rate and delayed response for
green and blue servers.

```
http://<your external IP>/?x-blue-delay=25&x-blue-error=.001&x-green-delay=10&x-green-error=.25
```

This will simulate a bad green release, and a need to rollback to a known good
blue release.

#### Parameter effect

These parameters can be modified in the above example as follows:

- **x-color-delay**: sets the mean delay in milliseconds.
- **x-color-error**: sets the error rate, describe as a fraction of 1 (e.g., 0.5
  causes an error 50% of the time).

The latency and error rates are passed to the demo servers as HTTP headers with
the same name and value as the URL parameters described. You can use these
parameters to help you visualize the effects of a bad release, or an issue with
the code in a new version of your application, which would be cause to step-down
the release and return traffic to a known-good version.

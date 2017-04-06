### Deployed state

Let’s dig deeper into how tbnproxy routes traffic. Traffic is received by a
proxy that handles traffic for a given domain. The proxy maps requests to
service instances via routes and rules. Routes let you split your domain into
manageable segments, for example `/bar` and `/baz`. Rules let you map requests
to a constrained set of service instances in clusters, for example “by default
send traffic to servers labeled `stage=prod`. Clusters contain sets of service
instances, each of which can be labeled with key/value pairs to provide more
information to the routing engine.

Your environment should look like the following:

{% if include.all_in_one %}
![Prismatic Setup](https://d16co4vs2i1241.cloudfront.net/uploads/tutorial_image/file/636842997144618507/0d8f89bd404654ad9ce3e35ee9d38960dd34c35661e89fcb561b6ae20e422283/column_sized_prismatic-setup.png)
{% else %}
<img src="https://img.turbinelabs.io/2017-03-17/prismatic-setup-kube-1.png"/>
{% endif %}

There is a single domain (`{% if include.all_in_one %}all-in-one-demo:80{% else
%}local.domain{% endif %}`) that contains two routes. `/api` handles requests to
our demo service instances, and `/` handles requests for everything else (in
this case the demo app). There are two clusters:

{% if include.all_in_one %}
- The all-in-one-client cluster has 3 instances, each labeled with a
different version (represented as a color). The blue and green instances are
also labeled `stage=prod`.
{% else %}
- The all-in-one-server cluster has one instance, labeled as
`stage=prod,version=blue`. The all-in-one-client cluster has a single instance
labeled `stage=prod`.
{% endif %}
- The all-in-one-server cluster has a single instance labeled
`stage=prod`.

{% if include.all_in_one %}
The rules currently map traffic to instances labeled with
`stage=prod,version=blue`, which is why only blue is showing. If we were to map
instead to `stage=prod` without with version label constraint, both blue and
green instances would match, and tbnproxy would load balance across them. In
this case you'd see an even split of blue and green.
{% endif %}

## Installing tbnproxy

With tbncollect seeing your instances, move on to launching tbnproxy with the
following command on the same instance as the collector with ports forwarded
appropriate to your service or site:

```shell
docker run -p 80:80 -d -e "TBNPROXY_API_KEY=<your api key>" -e "TBNPROXY_API_ZONE_NAME=<your zone name>" -e "TBNPROXY_PROXY_NAME=<your proxy name>" turbinelabs/tbnproxy:0.7.0
```

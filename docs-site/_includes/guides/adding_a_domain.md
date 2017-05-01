## Adding a domain and proxy

Tbnproxy is the container that handles request routing. It serves traffic for a
set of domains, which in turn contain release groups and routes. We'll create
the domain first

```shell
echo '{"name": "testbed-domain", "zone_key": "<your zone key>", "port": 80}' | tbnctl create domain
```

**Remember that you can get your zone's key by running `tbnctl list zone`**

If you want to use [jq](https://stedolan.github.io/jq/) (a fantastic
sed-like tool for json), you can save
yourself some cutting and pasting by doing the following

```shell
export ZONE_KEY=`tbnctl list zone | jq -r ".[] | select(.name == \"testbed\") | .zone_key"`

echo "{\"name\": \"testbed-domain\", \"zone_key\": \"$ZONE_KEY\", \"port\": 80}" | tbnctl create domain
```

This uses jq to store the zone key in an environment variable we can
use in the tbnctl create command.

And then add the proxy, substituting the domain key from the create domain
command.

```shell
echo '{"name": "testbed-proxy", "zone_key": "<your zone key>", "domain_keys": ["<domain_key>"]}' | tbnctl create proxy
```

or, using jq

```shell
export DOMAIN_KEY=`tbnctl list domain | jq -r ".[] | select(.name == \"testbed-domain\" and .zone_key == \"$ZONE_KEY\") | .domain_key"`

echo "{\"name\": \"testbed-proxy\", \"zone_key\": \"$ZONE_KEY\", \"domain_keys\": [\"$DOMAIN_KEY\"]}" | tbnctl create proxy
```

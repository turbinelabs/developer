---
layout: page
title: SSL Termination
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

[//]: # (Setting up SSL termination on at tbnproxy)

# Terminating SSL connections with tbnproxy

Two things are required to set `tbnproxy` up to terminate SSL connections. First
you need to arrange for `tbnproxy` to have access to files containing the SSL
certificate and private key. Next you configure the Houston `Domain` objects to
reference these files which implicitly enables SSL on those domains. Optionally
you may set up a URL redirect to have any HTTP trafic redirected to your HTTPS
endpoint.

Note: To do this without interrupting existing user traffic, this guide sets up
`tbnproxy` to serve HTTPS traffic without changing any IPs or DNS entries. In
staging, this may not matter. In production, we recommend you only remap IPs or
change DNS entries after fully configuring and testing the proxy.

## Configuring SSL files

The process to mount certificate and key files varies depending on the
combination of hardware and orchestration solution. If you're running on
kubernetes, we suggest you publish these as a secret and then follow the docs on
[mounting
secrets](https://kubernetes.io/docs/concepts/configuration/secret/#using-secrets-as-files-from-a-pod). ECS
similarly has a way to map [data volumes into a task
instance](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/using_data_volumes.html). And
if you're running on bare metal you can of course simply place the files using
your preferred fleet management tool.

In the end, though, you need to have two files available:

1. A certificate chain that will be served to your visitors, this should include
   any intermediates necessary for a client to validate your certifiacte.
2. An unencrypted private key in PEM format that corresponds to your
   certificate.

## Configuring Your Domain

Your `tbnproxy` instance needs to have the certificate it serves and the
unencrypted private key available at some path, let's call these
`/path/to/cert.crt` and `/path/to/key.pem` respectively

Now create the domain you would like to serve with SSL. In the UI this can be
done via `More > Add Domain` menu. Make sure to create this domain with
port 443. Once a domain exists and is associated with a proxy find its key [with
tbnctl](tbnctl.html):

```
$ tbnctl list zone
[
  {
    "zone_key": "<zonekey-1>",
    "name": "kubernetes-dev",
    "checksum": "<checksum>"
  },
  {
    "zone_key": "<zonekey-2>",
    "name": "kube-prod",
    "checksum": "<checksum>"
  }
]

$ tbnctl list domain name=secure.example.com zone_key=<zonekey-2>
[
  {
    "domain_key": "<domain-key>",
    "zone_key": "<zonekey-2>",
    "name": "secure.example.com",
    "port": 443,
    "redirects": null,
    "gzip_enabled": false,
    "cors_config": null,
    "aliases": null,
    "checksum": "<checksum>"
  }
]
```

We now need to edit the domain to update its ssl config:

```
$ tbnctl edit domain <domain-key>
```

```
{
  "domain_key": "<domain-key>",
  "zone_key": "<zonekey-2>",
  "name": "secure.example.com",
  "port": 443,
  "redirects": null,
  "gzip_enabled": false,
  "cors_config": null,
  "aliases": null,
  "checksum": "<checksum>",
  "ssl_config": {
    "cert_key_pairs": [
      {
        "certificate_path": "/path/to/cert.crt",
        "key_path": "/path/to/key.pem"
      }
    ]
  }
}
```

If the edit is a success a new version should be produced that contains
`cipher_filter` and `protocols` keys with no data. These are advanced settings
and are documented in [our
swagger.yml](https://github.com/turbinelabs/api/blob/master/swagger.yml#L1111).

## Handling HTTP -> HTTPS redirection

The above logic will only set up HTTPS traffic, so you'll find that typing in
`http://yoursite.com` won't actually load anything. If you want to serve both
secure and insecure versions from the proxy, you'll have to duplicate your
routing configuration across domains. For most real-world cases, though, you'll
want to force all HTTP traffic to HTTPS. This has the added benefit of only
requiring you to maintain configuration for a single domain.

Houston treats each domain/port combination as a separate entity. To handle HTTP
traffic, we'll create a domain that serves on port 80 with no rules except that
it will redirect all traffic to HTTPS on port 443.

Just like above, create a new domain in the UI under `More > Add Domain`, but
use port 80 instead of port 443. This will create a separate domain object:

```
$ tbnctl list domain name=secure.example.com zone_key=<zonekey-2>
[
  {
    "domain_key": "<domain-key>",
    "zone_key": "<zonekey-2>",
    "name": "secure.example.com",
    "port": 443,
    "redirects": null,
    "gzip_enabled": false,
    "cors_config": null,
    "aliases": null,
    "checksum": "<checksum>"
  },
  {
    "domain_key": "<domain-key-2>",
    "zone_key": "<zonekey-2>",
    "name": "secure.example.com",
    "port": 80,
    "redirects": null,
    "gzip_enabled": false,
    "cors_config": null,
    "aliases": null,
    "checksum": "<checksum>"
  }
]
```

Add a redirect to the port 80 version of this domain that forces all traffic to
the corresponding secure URL.

```
$ tbnctl edit domain <domain-key-2>
```

```
{
  "domain_key": "<domain-key-2>",
  "zone_key": "<zonekey-2>",
  "name": "secure.example.com",
  "port": 80,
    "redirects": [
      {
        "name": "force-https",
        "from": "(.*)",
        "to": "https://$host$1",
        "redirect_type": "permanent"
      }
    ]
  "gzip_enabled": false,
  "cors_config": null,
  "aliases": null,
  "checksum": "<checksum>"
}
```

You can test that this works by `curl`ing any URL under this domain and looking
for the correct 301:

```
$ curl -k -I -H 'host:yourdomain.com' yourdomain.com:80
HTTP/1.1 301 Moved Permanently
Content-Length: 185
Content-Type: text/html
Date: Wed, 23 Aug 2017 21:53:46 GMT
Location: https://yourdomain.com/
Server: nginx/1.12.1
X-Content-Type-Options: nosniff
Connection: keep-alive
```

Note: because this is a separate object, any `Route` objects and associated
rules will be ignored. The `Domain` object on port 80 will redirect to the
`Domain` object on port 443, at which point the HTTPS `Route`s will apply. Make
sure to do all your work on the HTTPS domain once you have this set up!

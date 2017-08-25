## Adding a domain and proxy

Tbnproxy is the container that handles request routing. It serves traffic for a
set of domains, which in turn contain release groups and routes. We'll create
the domain first.

Go to https://app.turbinelabs.io, and login with your email address
and password.

Click "Settings" in the top right portion of the screen, then "Edit
Routes".

The screen should indicate that you have no domains. Click "Add One".

<img src="/assets/no_domain.png"/>

type "testbed-domain" in the Name field, then Click "Add Domain"

<img src="/assets/add_domain.png"/>

The screen should now indicate that you have no proxies. Click "Add
One".

<img src="/assets/no_proxies.png"/>

type "testbed-proxy" in the Name field, and then check the box next to
testbed-domain:80. This indicates that the proxy you're adding will
serve traffic for testbed-domain. Click "Add Proxy"

<img src="/assets/add_proxy.png"/>

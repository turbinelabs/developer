## Configure routes

Now we have a proxy running and exposed to the Internet, along with clusters and
instances configured in the Turbine Labs service. Next we map requests to
clusters. Log in to https://app.turbinelabs.io with your email address and API
key.

First we'll create a route to send traffic to the all-in-one client.

1. Make sure you have the 'testbed' zone selected in the top left portion of the
screen.
2. Click the "Settings" menu in the top right portion of the screen, and then
select "Edit Routes".
3. Click the "More" menu, then select "Add Route".
4. Select your domain in the domain drop down
5. Enter "/" in the path field
6. Click the release group dropdown and select "Create New Release Group..."
7. Select "all-in-one-client" from the service drop down
8. Enter "client" in the release group name field
9. Click the "Create Route + Release Group" button

Now we'll repeat these steps to create a route to send anything going to /api to
the all-in-one server

1. Click the "Settings" menu in the top right portion of the screen, and then
select "Edit Routes".
2. Click the "More" menu, then select "Add Route".
3. Select your domain in the domain drop down
4. Enter "/api" in the path field
5. Click the release group dropdown and select "Create New Release Group..."
6. Select "all-in-one-server" from the service drop down
7. Enter "server" in the release group name field
8. Click the "Create Route + Release Group" button

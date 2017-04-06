### Set up an initial route

The rules currently map api traffic to all instances in the cluster,
which is why an even split of green and blue boxes is showing. To
enable the release workflow we need to constrain routing to a single
version at a single stage, so let's configure Houston to route traffic
to the blue version.

1. Make sure you have the 'testbed' zone selected in the top left portion of the
screen.
2. Click the "Settings" menu in the top right portion of the screen, and then
select "Edit Routes".
3. Click the "Select View" menu in the top left portion of the screen,
   and select the api route.
4. Change `1 to 'all-in-one-server'` to `1 to 'all-in-one-server'
   stage = prod & version = blue`
5. Click "Save Release Group"

If you look at the all-in-one client you should see all blue blocks,
because we've constrained the routing to only go to servers in the
cluster labeled with `version=blue`.

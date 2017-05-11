### Incremental release

Now we're ready to do an incremental release from blue to green. Right now the
default rules for `/api` send all traffic to blue. Let’s introduce a small
percentage of green traffic to customers.

Navigate to [app.turbinelabs.io](https://app.turbinelabs.io), then click
"Release Groups" below the top-line charts. The row "server"
should be marked "RELEASE READY". Click anywhere in the row to expand it, then
click "Start Release".

<img src="../assets/release_ready.png" height="100%" width="100%"/>

Let's send 25% of traffic to our new green version by
moving the slider and clicking "Start Release". The release group should now
be marked "RELEASING".

<img src="../assets/releasing_green.png" height="100%" width="100%"/>

The all in one client should now show a mix of blue and green. You can
increment the green percentage as you like. When you get to 100%, the release
is complete.

<img src="https://d16co4vs2i1241.cloudfront.net/uploads/tutorial_image/file/684828961254933996/b030e8b9bbcbe04c615c87a327bebe7525ec97c4b82e71be357e71efe28a9b16/column_sized_Screen_Shot_2017-01-26_at_9.49.37_PM.png" width="50%" height="50%"/>

Congratulations! You've safely and incrementally released a new version of your
production software. Both blue and green versions are still running; if a
problem were found with green, a rollback to blue would be just as easy.

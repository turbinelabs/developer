## Deploying a new version

Now we'll deploy a new version of the server that returns green as the
color to paint blocks. SSH into the instance that is running your current
all-in-one-client, then run a new Docker container with this command:

```console
$ docker run -p 8081:8081 -e "TBN_COLOR=<83D061>" -d turbinelabs/all-in-one-server:0.8.0
```

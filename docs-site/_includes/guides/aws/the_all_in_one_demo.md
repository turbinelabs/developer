## The all-in-one demo

Pick an instance to install the all-in-one client on and another to install the
server on. You may run multiple different apps on different ports of the same instance; the tags are used to let the collector know which app is running on which port.

### Running the all-in-one-client

With your new EC2 instances running Docker, you can now run the
all-in-one-client after using SSH to connect to your second instance.

```console
$ docker run -p 8080:8080 -d turbinelabs/all-in-one-client:0.7.0
```

Once the instance is running, add the following tags in the EC2 Console:

```
"tbn:cluster:all-in-one-client"="8080"
```

### Running the all-in-one-server

With your new EC2 instances running Docker, you can now run the
all-in-one-client after using SSH to connect to your third instance.

```console
$ docker run -p 8080:8080  -d turbinelabs/all-in-one-server:0.7.0
```

Once the instance is running, add the following tags in the EC2 Console:

```
"tbn:cluster:all-in-one-server"="8080"
```

and

```
"tbn:cluster:all-in-one-server:color"="blue"
```

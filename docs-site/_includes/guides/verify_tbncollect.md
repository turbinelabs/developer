Now verify that tbncollect has discovered your new pods and added them to the
appropriate clusters by running:

```console
$ tbnctl list --format=summary cluster
```

You should see a `name: all-in-one-client` cluster and a
`name: all-in-one-server`  cluster, each with a single instance. It may take up to 30 seconds for the new clusters to appear.

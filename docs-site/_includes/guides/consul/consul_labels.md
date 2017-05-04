## Labelling the all-in-one Consul services

In order for tbncollect to see your Consul nodes, they will need the label
`tbn-cluster`, which you can add in your service definitions as in this example:

```javascript
{
  "service": {
    "name": "node",
    "tags": ["tbn-cluster"],
    "address": "<ip_address>",
    "port": 8080,
    "enableTagOverride": false,
    "checks": [
      {
      }
    ]
  }
}
```
Once your nodes are running with this label, tbncollect will be able to take
note of them, and tbnproxy will be able to route user traffic from its IP
appropriately after it's installed in the next step.

### Label your new server
Add a label to your all-in-one-green server to your service definitions as in
this example:

```javascript
{
 "service": {
   "name": "node",
   "tags": ["tbn-cluster"],
   "address": "999.888.777.1",
   "port": 8081,
   "enableTagOverride": false,
   "checks": [
     {
     }
   ]
 }
}
```

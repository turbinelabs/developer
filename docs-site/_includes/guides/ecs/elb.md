### Create a service to expose tbnproxy

With your task definition created, we can then expose tbnproxy to the internet using an Elastic Load Balancer. First create your ELB using the management console, with no listeners. Now expose tbnproxy to the ELB by running Create Service from the [ECS control panel](http://docs.aws.amazon.com/AmazonECS/latest/developerguide/create-service.html#service-configure-load-balancing) or through the CLI:

```shell
aws ecs \
create-service \
  --cluster default \
  --service-name tbnproxy \
  --task-definition tbnproxy:1 \
  --desired-count 1
  --load-balancers <the ELB you created above goes here>
  ```

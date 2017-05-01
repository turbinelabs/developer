### Mapping an ELB to expose tbnproxy

With your instance running both tbncollect and tbnproxy, create an Elastic Load
Balancer through the AWS management console to send traffic through to your
tbncollect and tbnproxy node on the appropriate ports—in this example, TCP
port 80. Next, apply the security group: ELBGroup.

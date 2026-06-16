Loopback is a loopback outbound used to send traffic back to routing for further processing without leaving the core.

### TIP Uses

- In places where only an outbound can be specified and `balancerTag` cannot be written directly, Loopback lets you use a balancer indirectly.
  For example, `proxySettings` and `dialerProxy` in chained proxies, and `fallbackTag` in load balancing.
- After traffic has already been routed once, it can be further subdivided using more conditions.
  For example, TCP traffic and UDP traffic split by the same set of routing rules can be sent to different outbounds.

[Documentation ↗](https://xtls.github.io/en/config/outbounds/loopback.html)

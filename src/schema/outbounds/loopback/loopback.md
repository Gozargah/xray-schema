Loopback is a loopback outbound used to send traffic back to routing for further processing without leaving the core.

### WARNING Avoid Loops

Avoid letting rules or balancers after the loopback select the original outbound again, otherwise it may form an `outbound -> Loopback -> routing -> original outbound` loop.

### TIP Uses

- In places where only an outbound can be specified and `balancerTag` cannot be written directly, Loopback can be used to indirectly use a balancer.<br>
  For example, `proxySettings` and `dialerProxy` in chained proxies, and `fallbackTag` in load balancing.
- After traffic has already been routed once, it can be further subdivided based on more conditions.<br>
  For example, TCP traffic and UDP traffic routed by the same set of routing rules can be sent to different outbounds.

[Documentation ↗](https://xtls.github.io/en/config/outbounds/loopback.html)

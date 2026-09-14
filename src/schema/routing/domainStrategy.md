Domain resolution strategy. Different strategies are used based on different settings.

- `"AsIs"`: Does not perform DNS resolution. Default value.
- `"IPIfNonMatch"`: Domain names are not resolved initially. If no rule matches after the full pass and the target includes a domain name, Xray starts a second pass. During that pass, when it encounters a rule containing an `ip` condition, it uses the built-in DNS server to resolve the domain name to IPs for matching.
- `"IPOnDemand"`: If the target includes a domain name, Xray uses the built-in DNS server to resolve it to IPs for matching when it encounters a rule containing an `ip` condition. If resolution fails, the original destination IP is used for matching.

Resolution results contain both IPv4 and IPv6 addresses (this can be further restricted through the built-in DNS module's `queryStrategy`). When a domain name resolves to multiple IPs, each rule tries all of them in turn. If any IP meets the condition, the rule is considered matched.

The original destination may be either an IP address or a domain name. When [`sniffing`](https://xtls.github.io/en/config/inbound.html#sniffingobject) and `routeOnly` are enabled, the routing system can see the domain name obtained through sniffing in addition to the original destination. Therefore, even if no DNS resolution occurs, it can still use an IP already present in the original destination for rule matching. If both the original destination domain and the sniffing result are available, the sniffing result always takes precedence for both DNS resolution and domain matching.

Regardless of whether resolution occurs, the routing system will not affect the actual destination address. The requested target remains the original target.

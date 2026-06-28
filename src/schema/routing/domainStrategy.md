Domain resolution strategy. Different strategies are used based on different settings.

- `"AsIs"`: No extra operation. Uses the domain in the destination address or the sniffed domain. Default value.
- `"IPIfNonMatch"`: When no rule is matched after a full round of matching, resolve the domain to an IP and perform a second round of matching.
- `"IPOnDemand"`: Before starting matching, resolve the domain to an IP immediately for matching.

Actual resolution behavior will be delayed until the first IP rule is encountered to reduce latency. The result will contain both IPv4 and IPv6 (you can further restrict this via `queryStrategy` in the built-in DNS). When a domain resolves to multiple IPs, each rule will try all IPs in turn. If any IP meets the requirement, the rule is considered matched.

When `sniff` + `routeOnly` is enabled, allowing the routing system to see both IP and domain, if the aforementioned resolution occurs, the routing system can only see the IP resolved from the domain and cannot see the original destination IP, unless resolution fails.

When two domains exist (target domain + sniffed result), the priority of the sniffed result is always higher, whether for resolution or domain matching.

Regardless of whether resolution occurs, the routing system will not affect the actual destination address. The requested target remains the original target.

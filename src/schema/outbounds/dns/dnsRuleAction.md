Defines the action to take when the rule matches.

- `direct`: Allows the query directly to the target DNS server. If outbound-level `rewriteNetwork`, `rewriteAddress`, or `rewritePort` is also configured, the query is forwarded to the rewritten target.
- `hijack`: Imports the query into the built-in [DNS server](https://xtls.github.io/en/config/dns.html) for further processing. This can be used for additional routing based on the built-in DNS configuration. Currently, only A and AAAA records are supported.
- `drop`: Drops the request directly without returning a response.
- `return`: Returns a DNS response whose response code is specified by `rCode`. Compared with `drop`, this can prevent some applications from waiting too long for a DNS timeout or repeatedly retrying.

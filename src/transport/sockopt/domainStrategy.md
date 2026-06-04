When the target address is a domain name, this field controls how outbound connections resolve and use that target.

The default value is `"AsIs"`.

- `"AsIs"`: Xray does not specially handle the domain name. In the end it uses Go's built-in dialer directly.
- Any other value: Xray uses the built-in DNS server for resolution. If there is no `DNSObject`, system DNS is used. If multiple IP addresses match, the core randomly picks one target IP.
- `"IPv4"` means try IPv4 only. `"IPv4v6"` means try IPv4 or IPv6, but for dual-stack domains prefer IPv4. The same logic applies to the IPv6-first variants.

When built-in DNS also sets `queryStrategy`, the actual behavior is the intersection of the two settings.

### DANGER

Improper use of this feature can create an infinite loop when routing DNS traffic through the proxy itself.

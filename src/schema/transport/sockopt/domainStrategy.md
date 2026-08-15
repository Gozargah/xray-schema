When the target address is a domain name, this field controls how outbound connections resolve and use that target.

The default value is `"AsIs"`.

- `"AsIs"`: Xray does not specially handle the domain name. In the end it uses Go's built-in dialer directly.
- Any other value: Xray uses the built-in DNS server for resolution. If there is no `DNSObject`, system DNS is used. If multiple IP addresses match, the core randomly picks one target IP.
- `"IPv4"` means resolve IPv4 only. `"IPv4v6"` means resolve IPv4 first and resolve IPv6 only if that lookup returns an error or no IP addresses. If IPv4 addresses are resolved but subsequent connection attempts fail, it does not fall back to IPv6. `"IPv6"` and `"IPv6v4"` work analogously, with the address-family order reversed.

When built-in DNS also sets `queryStrategy`, the actual behavior is the intersection of the two settings.

### DANGER

Improper use of this feature can create an infinite loop when routing DNS traffic through the proxy itself.

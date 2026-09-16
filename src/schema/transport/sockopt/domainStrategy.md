This option controls how the connection destination's domain name is resolved when an outbound establishes an underlying connection.

- Proxy outbounds such as VLESS, VMess, and Trojan: the underlying connection is to the proxy server, so this option controls resolution of the proxy server's domain name. Whether the target domain name in the proxied request is resolved locally is controlled by the outbound's [`targetStrategy`](https://xtls.github.io/en/config/outbound.html#outboundobject).
- Freedom outbound: the underlying connection is to the request's target itself, so this option controls resolution of the request's target domain name.

The default value is `"AsIs"`.

The strategies work as follows:

- With `"AsIs"`, Xray passes the domain name to Go, which resolves it using the operating system's DNS settings and connects. TCP usually tries IPv6 first and tries IPv4 if the connection does not proceed smoothly; UDP prefers IPv4.

Address selection and fallback with AsIs

TCP uses Go's built-in Happy Eyeballs. The address family of the first resolved address is preferred. If the connection has not succeeded after 300 ms, attempts with the other address family begin. If all attempts with the preferred family fail sooner, the other family is tried immediately. This is not controlled by Xray's `sockopt.happyEyeballs`. See [Go's dialing implementation](https://go.dev/src/net/dial.go).

With a pure Go build of Xray, addresses are sorted using a simplified version of RFC 6724, which usually prefers IPv6 when other conditions are equal and does not read `/etc/gai.conf`. Most official Xray release builds use this approach; behavior may differ slightly on some operating systems or in downstream builds. See [Go's address sorting implementation](https://go.dev/src/net/addrselect.go).

UDP prefers an IPv4 address from the resolved results and uses IPv6 only if no IPv4 address is available. A send failure does not automatically switch to the other address family. See [Go's UDP address selection implementation](https://go.dev/src/net/ipsock.go).

Note that a `Use` strategy may fall back to `AsIs` if resolution fails or the results do not meet the requirements. In that case, both TCP and UDP follow the behavior described above.

- With any other value, Xray uses its [built-in DNS module](https://xtls.github.io/en/config/dns.html) for resolution. If no `DNSObject` is configured, system DNS is used. If multiple IP addresses match, one is selected randomly by default; when `sockopt.happyEyeballs` is enabled for TCP, the addresses are raced instead.
- `"IPv4"` means resolve IPv4 only. `"IPv4v6"` means resolve IPv4 first and resolve IPv6 only if that lookup returns an error or no IP addresses. If IPv4 addresses are resolved but subsequent connection attempts fail, it does not fall back to IPv6. `"IPv6"` and `"IPv6v4"` work analogously, with the address-family order reversed.
- When the built-in DNS module also sets `"queryStrategy"`, the resolved IP types are the intersection of the two settings: only IP types allowed by both are resolved. For example, `"queryStrategy": "UseIPv4"` together with `"domainStrategy": "UseIP"` behaves the same as `"domainStrategy": "UseIPv4"`.
- With a `"Use"` option, Xray falls back to `AsIs` if resolution fails or the results do not meet the requirements, such as a domain that only resolves to IPv4 while `UseIPv6` is selected.
- With a `"Force"` option, the connection cannot be established if resolution fails or the results do not meet the requirements.

### TIP

When using `"UseIP"` or `"ForceIP"`, and [OutboundObject](https://xtls.github.io/en/config/outbound.html#outboundobject) specifies `sendThrough`, the core automatically infers whether IPv4 or IPv6 is needed from the local address. If you manually force a single IP family, such as `UseIPv4`, but it conflicts with `sendThrough`, the connection fails.

### DANGER

Improper configuration of this feature can create an infinite loop! Connecting to the server needs a DNS result, but completing the DNS query also needs to connect to the server.

This feature is **not recommended** for inexperienced users unless they understand the routing implications.

Detailed explanation

1. Trigger condition: the proxy server address is a domain name (`proxy.com`), and the built-in DNS server is in non-Local mode.
2. Before Xray establishes a TCP connection to `proxy.com`, it queries `proxy.com` through the built-in DNS server.
3. The built-in DNS server connects to `dns.com` and sends a query to obtain the IP of `proxy.com`.
4. Bad routing rules cause the request sent in step 3 to be proxied through `proxy.com`.
5. Xray now tries to establish another TCP connection to `proxy.com`.
6. Before doing that, it again queries `proxy.com` through the built-in DNS server.
7. The built-in DNS server reuses the connection from step 3 and sends the new query.
8. The problem appears: the connection from step 3 is waiting for the query result from step 7, while step 7 cannot finish until the connection from step 3 is fully established.
9. Good game.

Direct connections through Freedom can have the same problem: if connecting to a DNS server requires resolving its own domain name through that same server, a circular dependency is created.

Possible solutions:

- Fix the traffic split of the built-in DNS server.
- Use hosts.

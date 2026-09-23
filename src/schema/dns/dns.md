Built-in DNS server. If this item is not configured, the system DNS settings are used.

The built-in DNS module in Xray has three main purposes:

- **Routing Phase:** Resolves domain names to IPs and matches rules based on the resolved IPs for traffic splitting.

Whether a domain name is resolved for IP-based routing depends on `routing.domainStrategy`. The built-in DNS server may be used for DNS queries only with the following values:

- `"IPIfNonMatch"`: If no rule matches during the first routing pass, resolution occurs whenever the target includes a domain name and at least one rule contains an `ip` condition.
- `"IPOnDemand"`: Resolution occurs when the target includes a domain name and a rule containing an `ip` condition is encountered.

- **Outbound Phase:** Resolves target domain names for connections or for sending to a remote proxy server.
  - For example, setting `targetStrategy` to `UseIP` in a VLESS outbound resolves the target domain of the proxied request through the local built-in DNS module, then sends the resolved IP to the remote proxy server.
  - Setting `sockopt.domainStrategy` to `UseIP` in a VLESS outbound resolves the VLESS server's domain through the built-in DNS module, then connects to the resolved IP.
  - Setting `sockopt.domainStrategy` to `UseIP` in a Freedom outbound resolves the request's target domain through the built-in DNS module, then connects to the resolved IP.
  - WireGuard does not allow domain names as destinations, so its outbound can use the built-in DNS module to resolve them to IPs.

- **TUN/Transparent Proxy DNS Traffic Hijacking:** Combines routing with the DNS outbound to hijack DNS traffic into this module; or uses [Tunnel](https://xtls.github.io/en/config/inbounds/tunnel.html) to expose port 53 and act as a recursive DNS server.
  - Only basic IP queries (A and AAAA records) are supported. CNAME records will be queried repeatedly until an A/AAAA record is returned. Other queries will not enter the built-in DNS server; instead, they may be discarded or transparently forwarded to other servers depending on your outbound configuration.

## DNS Processing Flow

The domain first undergoes a Hosts mapping check (see the `hosts` field). If the required IP is not found, the DNS server is used for the query.

The core then begins to build a list of servers, sorting them according to the requested domain based on the following rules.

- Build List 1: Contains servers where the `domains` field successfully matches the requested domain, in the order they appear in the configuration file.
- Check `disableFallback`: If true, skip building List 2.
- Check `disableFallbackIfMatch`: If true and List 1 is not empty, skip building List 2.
- Build List 2: Contains servers not in List 1 where `skipFallback` is not true, in the order they appear in the configuration file.
- Final Server List = List 1 + List 2.

Note: Any DNS server with `FinalQuery` set to true will directly truncate the subsequent parts of the list.

When executing a DNS query, the core will query the servers in the Final Server List sequentially. It filters the results using `expectedIPs` and `unexpectedIPs`; if the result is empty after filtering, it attempts the next server in the list. (Behavior differs slightly when `enableParallelQuery` is true; see its field description for details.)

[Documentation ↗](https://xtls.github.io/en/config/dns.html)

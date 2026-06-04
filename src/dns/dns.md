Built-in DNS server. If this item is not configured, the system DNS settings are used.

The built-in DNS module in Xray has three main purposes:

- **Routing Phase:** Resolves domain names to IPs and matches rules based on the resolved IPs for traffic splitting. Whether to resolve the domain and split traffic depends on the `domainStrategy` setting in the routing configuration module. The built-in DNS server is used for DNS queries only when the following two values are set:
  - `"IPIfNonMatch"`: When a domain is requested, Xray attempts to match it against the `domain` rules in the routing configuration. If no match is found, the built-in DNS server is used to resolve the domain, and the returned IP address is used to match against IP routing rules.
  - `"IPOnDemand"`: When any IP-based rule is encountered during matching, the domain is immediately resolved to an IP for matching.

- **Resolving Target Addresses for Connections:**
  - For example, in a `freedom` outbound, if `domainStrategy` is set to `UseIP`, requests sent from this outbound will first resolve the domain to an IP using the built-in server before connecting.
  - For example, in `sockopt`, if `domainStrategy` is set to `UseIP`, system connections initiated by this outbound will first resolve to an IP using the built-in server before connecting.

- **TUN/Transparent Proxy DNS Traffic Hijacking:** Combines routing with the DNS outbound to hijack DNS traffic into this module; or directly exposes port 53 to act as a recursive DNS server.

#### TIP 1

The DNS server enters the routing system for matching by default unless it contains `+local`. When using domain names within it, be aware of potential routing loops; `hosts` may help.

#### TIP 2

Only basic IP queries (A and AAAA records) are supported. CNAME records will be queried repeatedly until an A/AAAA record is returned. Other queries will not enter the built-in DNS server; instead, they may be discarded or transparently forwarded to other servers depending on your outbound configuration.

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

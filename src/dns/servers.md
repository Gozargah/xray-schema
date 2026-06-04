A list of DNS servers. Two types are supported: DNS address (string format) and [DnsServerObject](https://xtls.github.io/en/config/dns.html#dnsserverobject).

## When the value is `"localhost"`, it indicates using the local machine's preset DNS configuration.

## When the value is a DNS `"IP:Port"` address, such as `"8.8.8.8:53"`, Xray will use the specified UDP port of this address for DNS queries. The query follows routing rules. If no port is specified, port 53 is used by default.

## When the value is in the form of `"tcp://host:port"`, such as `"tcp://8.8.8.8:53"`, Xray will use `DNS over TCP` for queries. The query follows routing rules. If no port is specified, port 53 is used by default.

## When the value is in the form of `"tcp+local://host:port"`, such as `"tcp+local://8.8.8.8:53"`, Xray will use `TCP Local Mode (TCPL)` for queries. This means the DNS request will **not** pass through the routing component but will request directly via the Freedom outbound to reduce latency. If no port is specified, port 53 is used by default.

## When the value is in the form of `"https://host:port/dns-query"`, such as `"https://dns.google/dns-query"`, Xray will use `DNS over HTTPS` (RFC8484, abbreviated as DOH) for queries. Some providers have certificates for IP aliases, so you can write the IP directly, such as `https://1.1.1.1/dns-query`. Non-standard ports and paths can also be used, such as `"https://a.b.c.d:8443/my-dns-query"`.

## When the value is in the form of `"h2c://host:port/dns-query"`, such as `"h2c://dns.google/dns-query"`, Xray will use the `DNS over HTTPS` request format but will send the request in cleartext h2c. This cannot be used directly; in this case, you need to configure a Freedom outbound + streamSettings with TLS to wrap it into a normal DOH request. This is used for special purposes, such as customizing the SNI of DOH requests or using utls fingerprints.

## When the value is in the form of `"https+local://host:port/dns-query"`, such as `"https+local://dns.google/dns-query"`, Xray will use `DOH Local Mode (DOHL)` for queries. This means the DOH request will **not** pass through the routing component but will request directly via the Freedom outbound to reduce latency. Generally suitable for server-side use. Non-standard ports and paths can also be used.

## When the value is in the form of `"quic+local://host"`, such as `"quic+local://dns.adguard.com"`, Xray will use `DNS over QUIC Local Mode (DOQL)` for queries. This means the DNS request will **not** pass through the routing component but will request directly via the Freedom outbound. This method requires the DNS server to support DNS over QUIC. By default, port 853 is used for queries, and non-standard ports can be used.

## When the value is `fakedns`, the FakeDNS feature will be used for queries.

### TIP 1

When using `localhost`, the local machine's DNS requests are not controlled by Xray. Additional configuration is required to forward DNS requests through Xray.

### TIP 2

The DNS clients initialized by different rules will be shown in the Xray startup logs at the `info` level, such as `local DOH`, `remote DOH`, and `udp` modes.

### TIP 3

(v1.4.0+) You can enable DNS query logging in [Log](./log.md).

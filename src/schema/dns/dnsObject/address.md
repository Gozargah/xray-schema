## When the value is `"localhost"`, it indicates using the local machine's preset DNS configuration.

## When the value is a DNS `"IP"` address, such as `"8.8.8.8"`, Xray will use the specified UDP port of this address for DNS queries. The query follows routing rules. Defaults to port 53.

## When the value is in the form of `"tcp://host"`, such as `"tcp://8.8.8.8"`, Xray will use `DNS over TCP` for queries. The query follows routing rules. Defaults to port 53.

## When the value is in the form of `"tcp+local://host"`, such as `"tcp+local://8.8.8.8"`, Xray will use `TCP Local Mode (TCPL)` for queries. This means the DNS request will **not** pass through the routing component but will request directly via the Freedom outbound to reduce latency. If no port is specified, port 53 is used by default.

## When the value is in the form of `"https://host:port/dns-query"`, such as `"https://dns.google/dns-query"`, Xray will use `DNS over HTTPS` (RFC8484, abbreviated as DOH) for queries. Some providers have certificates for IP aliases, so you can write the IP directly, such as `https://1.1.1.1/dns-query`. Non-standard ports and paths can also be used, such as `"https://a.b.c.d:8443/my-dns-query"`.

## When the value is in the form of `"https+local://host:port/dns-query"`, such as `"https+local://dns.google/dns-query"`, Xray will use `DOH Local Mode (DOHL)` for queries. This means the DOH request will **not** pass through the routing component but will request directly via the Freedom outbound to reduce latency. Generally suitable for server-side use. Non-standard ports and paths can also be used.

## When the value is in the form of `"quic+local://host:port"`, such as `"quic+local://dns.adguard.com"`, Xray will use `DOQ Local Mode (DOQL)` for queries. This means the DNS request will **not** pass through the routing component but will request directly via the Freedom outbound. This method requires the DNS server to support DNS over QUIC. By default, port 853 is used for queries, and non-standard ports can be used.

## When the value is `fakedns`, the FakeDNS feature will be used for queries.

### About Local Mode and the Domain of the DNS Server Itself

## There are two scenarios for DNS requests sent by the DNS module:

## **Local Mode** connections are made directly outwards by the core. In this case, if the address is a domain name, it will be resolved by the system itself. The logic is relatively simple.

## **Non-Local** modes will essentially be treated as requests coming from an inbound with the tag `dns.tag` (Don't know where it is? Ctrl+F in your browser to search for `inboundTag`). They will go through the normal core processing flow and may be assigned by the routing module to a local freedom or other remote outbounds. They will be resolved by the freedom's `domainStrategy` (beware of potential loops) or sent directly as domains to the remote end to be resolved according to the server's own resolution method.

## Since it might be difficult for average users to clarify the logic involved, it is recommended (especially in a transparent proxy environment) to **directly set the corresponding IPs for servers with domain names in the host option of the DNS module** to prevent loops.

Incidentally, DNS requests sent by the DNS module in non-local modes will automatically skip the `IPIfNonMatch` and `IPOnDemand` resolution processes in the routing module. This prevents their resolution from being sent back to the DNS module, causing a loop.

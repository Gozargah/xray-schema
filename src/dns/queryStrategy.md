## Limits the capabilities of all servers in the DNS module and sets the default value for IP query types initiated by Xray itself.

## The default value `UseIP` allows querying both A + AAAA records. When a query initiated by Xray itself does not specify an IP type, both A and AAAA records are queried from the upstream DNS server. `UseIPv4` only queries and allows querying A records; `UseIPv6` only queries and allows querying AAAA records.

## `UseSystem` adapts to the operating system's network environment. Before querying, it checks whether there are IPv4 and IPv6 default gateways, thereby limiting the capabilities of all servers and setting the default query type. It checks in real-time on graphical OS environments and only once on command-line environments.

---

### TIP 1

## The global `"queryStrategy"` value takes precedence. When the `"queryStrategy"` value in a sub-item conflicts with the global `"queryStrategy"` value, the query for that sub-item will return an empty response.

### TIP 2

## When the `"queryStrategy"` parameter is not written in a sub-item, the global `"queryStrategy"` parameter value is used. This behavior is the same as versions prior to Xray-core v1.8.6.

For example:<br>
Global `"queryStrategy": "UseIPv6"` conflicts with sub-item `"queryStrategy": "UseIPv4"`.<br>
Global `"queryStrategy": "UseIPv4"` conflicts with sub-item `"queryStrategy": "UseIPv6"`.<br>
Global `"queryStrategy": "UseIP"` does not conflict with sub-item `"queryStrategy": "UseIPv6"`.<br>
Global `"queryStrategy": "UseIP"` does not conflict with sub-item `"queryStrategy": "UseIPv4"`.

---

---

The sub-item query for the Netflix domain returns an empty response due to the conflicting `"queryStrategy"` value. The Netflix domain is then queried by `https://1.1.1.1/dns-query`, returning an A record.

The list of DNS servers assigned to the TUN interface, such as `"1.1.1.1"` and `"8.8.8.8"`.

This option only takes effect on Windows, where the servers are set on the TUN interface. Windows sends name queries to them as well as to the DNS servers of the other interfaces; `"dns"` in `autoSystemWfpBlockLeak` blocks the latter. Queries to these servers only go through the TUN interface when the servers are covered by `gateway` or `autoSystemRoutingTable`. In Xray they are ordinary traffic to port 53: a routing rule can hand them to a [DNS outbound](https://xtls.github.io/en/config/outbounds/dns.html), otherwise they are forwarded to the servers like other traffic. The addresses of the TUN interface are not registered in DNS, and the DNS cache is flushed when the TUN interface starts and stops.

When `autoOutboundsInterface` is in use, the `localhost` DNS server of Xray skips these servers (unless another interface uses them too), as its queries to them would lead back into the TUN interface.

On Linux and FreeBSD, the system DNS is not taken from this option; see `autoSystemDnsToGateway`. On macOS, the system DNS is not configured.

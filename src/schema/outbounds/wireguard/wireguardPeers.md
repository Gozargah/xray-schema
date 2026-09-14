List of WireGuard servers, where each item is a server configuration. When multiple servers are configured, Xray prefix-matches the destination IP address against each server's `allowedIPs` and routes the traffic to the matching server, allowing different destination networks to be forwarded through different WireGuard servers.

TCP and UDP connections entering the WireGuard outbound are converted by the network stack into inner IP packets. The inner source address is selected from `address`, while the inner destination address is the destination IP of the proxied traffic.

Xray prefix-matches the inner destination address against each peer's `allowedIPs`. The matching peer encrypts and encapsulates the packet, and Xray sends the resulting outer UDP packet to that peer's `endpoint`. Therefore, `address` specifies the inner source addresses used by the client, `allowedIPs` acts as the destination routing table used to select a peer, and `endpoint` is the server address used by the outer connection.

### TIP

Each WireGuard server must allow all addresses in `address` that belong to the same address family as its `allowedIPs`: if `allowedIPs` contains only IPv4 networks, allow all IPv4 addresses listed in `address`; if it contains only IPv6 networks, the same rule applies to the IPv6 addresses; if it contains both IPv4 and IPv6 networks, allow all listed addresses.

When using Xray as the WireGuard server, list these addresses in `inbounds[].settings.peers[].allowedIPs`.

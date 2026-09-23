Specifies the source IP addresses or networks that this client is allowed to send, using CIDR notation. The default value is `["0.0.0.0/0", "::/0"]`, meaning all IPv4 and IPv6 source addresses are allowed.

Can be omitted when only one client is configured, with a default value of `["0.0.0.0/0", "::/0"]`. When configuring multiple clients, unlike the client-side `allowedIPs`, the `allowedIPs` here should not overlap; at best it prevents properly matching the client peer, and at worst it may prevent properly routing return packets.

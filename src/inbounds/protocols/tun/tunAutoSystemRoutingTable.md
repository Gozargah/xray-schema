The list of destination prefixes that Xray should add to the system routing table automatically so that the traffic is directed into this TUN interface. Each item is a CIDR. For example, `"0.0.0.0/0"` means all IPv4 traffic, and `"::/0"` means all IPv6 traffic.

Currently only supported on Windows. On other systems, the routing table must be configured manually.

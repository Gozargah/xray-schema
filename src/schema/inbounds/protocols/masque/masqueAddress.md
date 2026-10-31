Address ranges assigned to the tunnels, required. At most one IPv4 prefix and one IPv6 prefix (prefix length at most 30 for IPv4 and 126 for IPv6).

The address in the prefix is the server's own address, and the remaining addresses are assigned to the tunnels in order (excluding the network and broadcast addresses for IPv4) and reclaimed after a tunnel disconnects. When the addresses of one address family run out, new tunnels only get an address from the other address family; when both run out, 503 is returned.

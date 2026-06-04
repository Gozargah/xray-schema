The IP address used to send data. This is effective when the host has multiple IP addresses. The default value is `"0.0.0.0"`.

You can enter an IPv6 CIDR block (e.g., `114:514:1919:810::/64`), and Xray will use a random IP address from the address block to initiate external connections. You need to correctly configure the network access method, routing table, and kernel parameters to allow Xray to bind to any IP within the address block.

For networks using NDP access, it is not recommended to set a subnet smaller than `/120`. Otherwise, it may cause issues such as NDP flooding, leading to the router's neighbor cache becoming full.

Special value `origin`: If this value is used, the request will be sent using the IP address of the local machine that received the connection.

Special value `srcip`: If this value is used, the request will be sent using the source IP address of the inbound connection.

For example, if the machine has a full IPv4 range `11.4.5.0/24` and listens on `0.0.0.0` (all IPv4 and IPv6 on the network interface), if a client connects to the local machine via `11.4.5.14`, the outbound request will also be sent via `11.4.5.14`. If the client connects via `11.4.5.10`, the outbound request will also be sent via `11.4.5.10`. This also applies to cases where the machine has a full range/multiple IPv6 addresses.

As mentioned in the inbound introduction, because of the connectionless nature of UDP, Xray cannot know the original destination IP where the request entered the core (for example, in the same QUIC connection, it might even change), so this feature cannot take effect for UDP.

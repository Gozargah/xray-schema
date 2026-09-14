List of WireGuard clients, where each item is a client configuration. When multiple clients are configured, Xray matches the source address of each decrypted inner IP packet against the clients' `allowedIPs` to identify which client the traffic belongs to.

An Xray WireGuard inbound does not create a TUN interface on the system, nor does the server need an in-tunnel IP address. The built-in network stack processes the decrypted inner IP packets, converts their TCP and UDP traffic into proxy connections, and passes those connections to the Xray routing system instead of forwarding the original IP packets.

A client can send its own traffic or act as a gateway for networks behind it. The Xray server does not act as a Layer 3 node that clients can access inside the tunnel, and it does not pass the original IP packets to the system kernel for further forwarding or NAT.

`allowedIPs` participates in packet processing in both directions: when receiving packets, WireGuard verifies the source address of the decrypted inner IP packet and Xray uses that address to identify the client; when sending response packets, WireGuard selects the corresponding client based on the inner destination address.

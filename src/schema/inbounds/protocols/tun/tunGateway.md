The list of address prefixes assigned to the TUN interface, usually one for IPv4 and one for IPv6, such as `"10.0.0.1/16"` and `"fc00::1/64"`.

If it is not set, the result depends on the system: on Linux, Xray assigns no address; on Windows, the system gives the TUN interface link-local addresses itself (IPv6 at once, IPv4 from `169.254.0.0/16` after a few seconds); on macOS and FreeBSD, `169.254.10.1/30` is used. macOS and FreeBSD only use the first IPv4 prefix.

On Windows with IPv6 turned off by `DisabledComponents` (0x10 set, such as 0xFF), errors setting up the IPv6 entries here, in `dns` and in `autoSystemRoutingTable`, or clearing the IPv6 DNS servers when `dns` has none, are only logged. Otherwise, they keep the TUN interface from starting.

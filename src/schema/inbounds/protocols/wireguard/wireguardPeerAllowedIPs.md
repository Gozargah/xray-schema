Specifies the source IP addresses or networks that this client is allowed to send, with each item expressed in CIDR notation.

The client's outbound `address` must be included in the corresponding server peer's `allowedIPs`. For example, if the client's `outbounds[].settings.address` is `["10.0.0.2"]`, this field can be set to `["10.0.0.2/32"]`.

`allowedIPs` can contain not only the client's in-tunnel IP address, but also networks routed through that peer. For example, if a third-party WireGuard client acts as a gateway for `192.168.10.0/24`, that network can be included here; the client must also configure routing and enable IP forwarding itself.

This field can be omitted when only one client is configured; the default is `["0.0.0.0/0", "::/0"]`. When multiple clients are configured, explicitly specify non-overlapping `allowedIPs`; otherwise, Xray cannot reliably distinguish between clients.

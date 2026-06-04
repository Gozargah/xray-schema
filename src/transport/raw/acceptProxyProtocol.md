Only used for inbound; indicates whether to accept PROXY protocol.

[PROXY protocol](https://www.haproxy.org/download/2.2/doc/proxy-protocol.txt) is dedicated to passing the real source IP and port of the request. If you don't know what it is, please ignore this item for now.

Common reverse proxy software (such as HAProxy, Nginx) can be configured to send it. VLESS fallbacks xver can also send it.

When set to `true`, after the underlying TCP connection is established, the requester must send PROXY protocol v1 or v2 first; otherwise, the connection will be closed.

Default value is `false`.

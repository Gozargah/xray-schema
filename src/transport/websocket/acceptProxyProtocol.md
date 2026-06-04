Only used for inbound, indicating whether to receive PROXY protocol.

[PROXY protocol](https://www.haproxy.org/download/2.2/doc/proxy-protocol.txt) is specifically used to pass the real source IP and port of the request. If you don't understand it, please ignore this item.

Common reverse proxy software (such as HAProxy, Nginx) can be configured to send it, and VLESS fallbacks xver can also send it.

When set to `true`, after the underlying TCP connection is established, the requester must send PROXY protocol v1 or v2 first; otherwise, the connection will be closed.

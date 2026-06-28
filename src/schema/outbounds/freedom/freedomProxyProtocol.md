PROXY protocol is usually used with `redirect` to redirect traffic to Nginx or other backend services that have the PROXY protocol enabled. If the backend service does not support PROXY protocol, the connection will be disconnected.

The value of `proxyProtocol` is the PROXY protocol version number. Options are `1` or `2`. If not specified, it defaults to `0` (disabled).

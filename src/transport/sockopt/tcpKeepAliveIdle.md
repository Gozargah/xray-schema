TCP idle threshold in seconds. Once a TCP connection has been idle for this long, Keep-Alive probes begin.

For outbound, Xray uses Chrome's default values, where both idle and interval are 45 seconds. Setting either this field or `tcpKeepAliveInterval` to a negative value disables that default keepalive; a positive value overrides it.

For inbound, Keep-Alive is disabled by default. It becomes enabled when either this field or `tcpKeepAliveInterval` is non-zero. If only one is set, the other follows the operating-system default.

The listening address, which can be an IP address or a Unix domain socket. The default value is `"0.0.0.0"`, which means listening on all network interfaces.

You can specify an IP address available on the system.

`"::"` is equivalent to `"0.0.0.0"`; both will listen on IPv6 and IPv4 simultaneously. However, if you only want to listen on IPv6, you can set `v6only` in `sockopt` to true. If you only want to listen on IPv4, you can use commands like `ip a` to view the specific IP on the network card (usually the machine's public IP address or a private network address like 10.x.x.x) and listen on that. Of course, you can do the same for IPv6.

Note that because UDP is not connection-oriented, if the inbound is based on UDP and there are multiple IP addresses on the network card, and the external connection is to a non-preferred address on the card, Xray might incorrectly use the preferred address as the source address for the reply instead of the target of the external connection, causing the connection to fail. The solution is not to listen on `0.0.0.0` but to listen on the specific IP address on the network card.

Supports Unix domain sockets in absolute path format, such as `"/dev/shm/domain.socket"`. You can add `@` at the beginning to represent [abstract](https://www.man7.org/linux/man-pages/man7/unix.7.html), and `@@` for abstract with padding.

When filling in a Unix domain socket, `port` and `allocate` will be ignored. The protocol can currently be VLESS, VMess, or Trojan, and applies only to TCP-based transport methods, such as `tcp`, `websocket`, `grpc`. UDP-based transports like `mkcp` are not supported.

When filling in a Unix domain socket, you can use the format `"/dev/shm/domain.socket,0666"`, i.e., adding a comma and access permission indicators after the socket, to specify the access permissions of the socket. This can be used to solve socket permission issues that occur by default.

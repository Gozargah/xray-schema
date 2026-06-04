Transport configuration controls how the current Xray instance communicates with its peer. That peer may be another Xray node, or it may simply be any ordinary public network target.

It covers the part below the proxy protocol itself, including transport methods, transport security, and additional low-level behavior.

These three categories belong to different layers and can usually be combined:

- Transport methods specify how the data stream is carried, such as RAW, WebSocket, gRPC, Hysteria, and others.
- Transport security specifies the protection mechanism used during transport, such as TLS or REALITY.
- Additional configuration supplements low-level network behavior and final traffic obfuscation.

Some transport settings directly affect how a connection is established with the remote side. For settings that require negotiation, both sides usually need compatible configurations. For example, if one side uses WebSocket, the other side must also use WebSocket, otherwise the connection cannot be established.

For direct outbounds such as [Freedom](https://xtls.github.io/en/config/outbounds/freedom.html), the peer is usually any ordinary public network target, such as Amazon's website or WeChat's servers. In that case, transport configuration does not need to negotiate with the other side, and generally cannot do so either. Instead, it is used to control how the local connection is sent. In that scenario, only `sockopt` is available.

[Documentation ↗](https://xtls.github.io/en/config/transport.html)

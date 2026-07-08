[Trojan](https://trojan-gfw.github.io/trojan/protocol) protocol.

### WARNING

Trojan must be used with transport-security [TLS](https://xtls.github.io/config/transports/tls.html); using `streamSettings.security: "none"` is only allowed when the peer is a private address (such as a private IP address or private domain name) and the link itself is trusted. In public environments, Mux is also required; otherwise, once the inner payload is itself TLS, it becomes TiT and can be easily detected ([PoC](https://github.com/XTLS/Trojan-killer)).

[Documentation ↗](https://xtls.github.io/en/config/outbounds/trojan.html)

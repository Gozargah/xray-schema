VLESS is a stateless lightweight transport protocol. It consists of inbound and outbound parts and can serve as a bridge between the Xray client and server.

Unlike [VMess](https://xtls.github.io/en/config/outbounds/vmess.html), VLESS does not depend on system time. The authentication method is also UUID.

### WARNING

VLESS must be used with an outer transport-security layer unless the peer is a private address (such as a private IP address or private domain name) and the link itself is trusted, or `VLESS Encryption` is enabled. In those cases, `streamSettings.security: "none"` is allowed.

[Documentation ↗](https://xtls.github.io/en/config/outbounds/vless.html)

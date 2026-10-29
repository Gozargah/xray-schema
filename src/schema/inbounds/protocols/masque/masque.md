A MASQUE CONNECT-IP ([RFC 9484](https://www.rfc-editor.org/rfc/rfc9484)) server. It can be connected to by the MASQUE [outbound](https://xtls.github.io/en/config/outbounds/masque.html) and by other clients that follow this standard and use HTTP Basic authentication.

Every tunnel must pass HTTP Basic authentication, and 401 is returned on failure. The server assigns addresses to each tunnel from `address` and, for the assigned address families, advertises routes covering the entire address space. TCP and UDP inside the tunnel are restored into ordinary connections by the server's user-space network stack and then handed over to routing; the source address at this point is the client's address inside the tunnel. Packets sent to other tunnel addresses are forwarded directly without going through routing.

The HTTP version to listen on is determined by `alpn` in `tlsSettings`, and `path` is set in the transport configuration item [masqueSettings](https://xtls.github.io/en/config/transports/masque.html).

### TIP

The MASQUE inbound can only be used with the `masque` transport method and must use `tls`.

[Documentation ↗](https://xtls.github.io/en/config/inbounds/masque.html)

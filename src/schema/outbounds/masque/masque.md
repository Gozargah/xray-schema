A MASQUE CONNECT-IP ([RFC 9484](https://www.rfc-editor.org/rfc/rfc9484)) client that establishes an IP tunnel on the server over HTTP/3 or HTTP/2. It can connect to the MASQUE [inbound](https://xtls.github.io/en/config/inbounds/masque.html), Cloudflare WARP, and other servers that follow this standard and assign addresses to clients.

Similar to the WireGuard outbound, Xray runs a user-space network stack locally and, using the address assigned by the server, converts TCP and UDP traffic into IP packets and sends them into the tunnel. All connections of the same outbound share one tunnel; the tunnel is established on the first connection and, after it disconnects, is re-established on the next connection.

HTTP requests and authentication are configured in the transport configuration item [masqueSettings](https://xtls.github.io/en/config/transports/masque.html), and the HTTP version is determined by `alpn` in `tlsSettings`. For connecting to WARP, see [Connecting to Warp via MASQUE](https://xtls.github.io/en/document/level-2/warp.html#connecting-to-warp-via-masque).

### TIP

The MASQUE outbound can only be used with the `masque` transport method, must use `tls`, and does not support Mux.

[Documentation ↗](https://xtls.github.io/en/config/outbounds/masque.html)

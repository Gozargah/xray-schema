The MASQUE CONNECT-IP ([RFC 9484](https://www.rfc-editor.org/rfc/rfc9484)) transport, which carries IP packets over HTTP/3 or HTTP/2 and is used together with the MASQUE [outbound](https://xtls.github.io/en/config/outbounds/masque.html) and [inbound](https://xtls.github.io/en/config/inbounds/masque.html).

- HTTP/3: based on QUIC; IP packets are sent and received as QUIC DATAGRAMs.
- HTTP/2: based on TCP; it establishes the tunnel with Extended CONNECT ([RFC 8441](https://www.rfc-editor.org/rfc/rfc8441)) and can be used on networks where UDP is unavailable.

Which HTTP version is used is determined by `alpn` in `tlsSettings`:

- Outbound: HTTP/2 is used when `alpn` contains `h2` but not `h3`; otherwise HTTP/3 is used.
- Inbound: when `alpn` contains `h2`, HTTP/2 is served over TCP; when it contains `h3` or does not contain `h2`, HTTP/3 is served over UDP; when it contains both, both are served on the same port at the same time.

### TIP

`tls` must be used; REALITY is not supported.

When HTTP/3 is used, the QUIC initial packet size is fixed at 1350 bytes, and the connection cannot be established when the path MTU is smaller; unlike Hysteria and XHTTP H3, it does not mimic Chrome's QUIC fingerprint. The congestion control of [quicParams](https://xtls.github.io/en/config/transports/finalmask.html#quicparams) defaults to `bbr`, and `brutal` also runs as `bbr`; use `force-brutal` when you need Brutal.

When HTTP/2 is used, the outbound TLS handshake uses `fingerprint` from `tlsSettings`, which defaults to `chrome`, and `quicParams` has no effect.

The UDP masks of [FinalMask](https://xtls.github.io/en/config/transports/finalmask.html) apply to HTTP/3, and the TCP masks apply to HTTP/2.

To connect to Cloudflare WARP, see [Connecting to Warp via MASQUE](https://xtls.github.io/en/document/level-2/warp.html#connecting-to-warp-via-masque).

[Documentation ↗](https://xtls.github.io/en/config/transports/masque.html)

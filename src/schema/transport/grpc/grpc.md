A transport protocol based on gRPC.

It is based on the HTTP/2 protocol and, theoretically, can be relayed through other servers that support HTTP/2 (such as Nginx). gRPC (HTTP/2) has built-in multiplexing. It is not recommended to enable mux.cool when using gRPC and HTTP/2.

### DANGER

It is recommended to switch to [XHTTP](https://github.com/XTLS/Xray-core/discussions/4113). Its advantages over gRPC are noted in the STREAM-UP/ONE section.

### WARNING

- gRPC does not support specifying Host. Please fill in the correct domain name in the outbound proxy address, or fill in `ServerName` in `(x)tlsSettings`, otherwise the connection will fail.
- gRPC does not support falling back to other services.
- gRPC services are at risk of active probing. It is recommended to use reverse proxy tools such as Caddy or Nginx to split traffic via Path prefix.

### TIP

If you use reverse proxies like Caddy or Nginx, please note the following:

- Ensure the reverse proxy server has enabled HTTP/2.
- Use HTTP/2 or h2c (Caddy), grpc_pass (Nginx) to connect to Xray.
- The Path for normal mode is `/${serviceName}/Tun`, and for Multi mode is `/${serviceName}/TunMulti`.
- If you need to receive the client IP, you can pass the client IP by having Caddy / Nginx send the `X-Real-IP` header.

### TIP

If you are using fallback, please note the following:

- Falling back to gRPC is not recommended due to the risk of active probing.
- Please ensure `h2` is in the first position in `(x)tlsSettings.alpn`, otherwise gRPC (HTTP/2) may fail to complete the TLS handshake.
- gRPC cannot be split by Path.

[Documentation ↗](https://xtls.github.io/en/config/transports/grpc.html)

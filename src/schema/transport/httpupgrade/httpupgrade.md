A protocol that implements HTTP 1.1 upgrade requests and responses similar to WebSocket. This allows it to be reverse-proxied by CDNs or Nginx just like WebSocket, but without the need to implement other parts of the WebSocket protocol, resulting in higher efficiency. Its design is not recommended for standalone use; instead, it is intended to work with security protocols like TLS.

### DANGER

It is recommended to switch to [XHTTP](https://github.com/XTLS/Xray-core/discussions/4113) to avoid significant traffic fingerprints such as HTTPUpgrade's "ALPN is http/1.1".

[Documentation ↗](https://xtls.github.io/en/config/transports/httpupgrade.html)

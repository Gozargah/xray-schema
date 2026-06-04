An array of strings that specifies the ALPN values used during TLS handshake. The default value is `["h2", "http/1.1"]`.

Special value `["FromMitM"]`, when it is the only element, causes outbound TLS to reuse the ALPN from the TLS connection decrypted by a `dokodemo-door` inbound.

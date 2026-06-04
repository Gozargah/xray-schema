TLS configuration. TLS is provided by Go. In normal cases the negotiation result is TLS 1.3. DTLS is not supported.

Only valid when `security` is `tls`. It supports use with the `RAW`, `XHTTP`, `mKCP`, `gRPC`, `WebSocket`, `HTTPUpgrade`, and `Hysteria` transport methods.

Flow control mode, used to select the XTLS algorithm.

Available inbound flow control modes:

- Empty string: use standard TLS proxy.
- `xtls-rprx-vision`: use the new XTLS mode, including inner handshake random padding.

XTLS is only available under the following combinations:

- TCP+TLS/REALITY: In this case, if transmitting TLS 1.3, the core will attempt to Splice encrypted data at the bottom layer. If successful, it saves all core IO overhead.
- VLESS Encryption: no underlying transport restrictions. If the underlying layer does not support direct copying (see above), it only penetrates Encryption.

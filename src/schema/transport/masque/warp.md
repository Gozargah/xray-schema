Device information for connecting to Cloudflare WARP. When it is set, `host` defaults to `cloudflareaccess.com` and `path` defaults to `/`, `user` / `pass` can no longer be set, and the tunnel addresses come from its `address` instead of being assigned by the server. If `pinnedPeerCertSha256` or `verifyPeerCertByName` is set in `tlsSettings`, its `publicKey` is ignored and the server certificate is verified by those instead.

### WARNING

Unlike WireGuard, MASQUE uses a **P-256 (secp256r1)** device key (the `privateKey` below). The wgcf / warp-reg tools described earlier generate WireGuard Curve25519 keys, which masque cannot use. You need to obtain this P-256 private key and its `address` through a registration method that supports MASQUE; for `publicKey`, simply use the edge public key read above. The device must also have `warp_enabled` turned on, otherwise the endpoint returns access denied.

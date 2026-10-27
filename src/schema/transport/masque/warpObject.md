### WARNING

Unlike WireGuard, MASQUE uses a **P-256 (secp256r1)** device key (the `privateKey` above). The wgcf / warp-reg tools described earlier generate WireGuard Curve25519 keys, which masque cannot use. You need to obtain this P-256 private key and its `address` through a registration method that supports MASQUE; for `publicKey`, simply use the edge public key read above. The device must also have `warp_enabled` turned on, otherwise the endpoint returns access denied.

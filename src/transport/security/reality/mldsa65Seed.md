Server-side private key used to add an extra post-quantum signature to the certificate sent to the REALITY client, using ML-DSA-65.

Generate the keypair with `xray mldsa65`.

After the server is configured with the private key, the signature is added only as a certificate extension, so it does not affect old clients or clients that do not enable this feature.

The target certificate must be larger than 3500 bytes because the post-quantum signature makes the temporary REALITY certificate larger.

To avoid becoming a fingerprint, the `target` certificate also needs to be large.

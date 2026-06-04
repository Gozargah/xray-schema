An array of strings that specifies the curves supported when performing ECDHE during TLS handshake. Supported values are:

- `CurveP256`
- `CurveP384`
- `CurveP521`
- `X25519`
- `X25519MLKEM768`
- `SecP256r1MLKEM768*`
- `SecP384r1MLKEM1024*`

(\*: not supported by uTLS)

As of Go 1.26, the default includes all curves above. Changing the order does not force either side to prefer a specific curve; the actual curve is negotiated by the key-exchange mechanism itself.

Client private key. Required.

You can generate a client key pair with the `xray wg` command. Enter the generated `PrivateKey` here; the accompanying `Password (PublicKey)` is the client public key. When using Xray as a WireGuard server, enter the client public key in `inbounds[].settings.peers[].publicKey`.

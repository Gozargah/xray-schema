Server private key. Required.

You can generate a server key pair with the `xray wg` command. Enter the generated `PrivateKey` here; the accompanying `Password (PublicKey)` is the server public key. When using Xray as a WireGuard client, enter the server public key in `outbounds[].settings.peers[].publicKey`.

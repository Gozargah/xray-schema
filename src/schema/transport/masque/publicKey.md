The P-256 public key (SubjectPublicKeyInfo) of the MASQUE endpoint certificate, in either PEM or base64. The server certificate is pinned to this public key, so `serverName` can be set to anything; if `pinnedPeerCertSha256` or `verifyPeerCertByName` is set in `tlsSettings`, `publicKey` is ignored and only those are used. The current masque edge (e.g. `162.159.198.2`) uses a fixed self-signed certificate, and you can read its public key yourself:

```bash
openssl s_client -connect 162.159.198.2:443 \
  -servername consumer-masque.cloudflareclient.com -alpn h2 -tls1_3 </dev/null \
  | openssl x509 -noout -pubkey | openssl pkey -pubin -outform der | base64 -w 0
```

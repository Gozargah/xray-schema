Used to specify the SHA-256 hash of the remote server certificate. It uses hexadecimal encoding and is case-insensitive, for example `e8e2d387fdbffeb38e9c9065cf30a97ee23c0e3d32ee6f78ffae40966befccc9`. Multiple hash values can be joined with `,`, and verification succeeds if any one of them matches.

This encoding matches the SHA-256 certificate fingerprint shown by the Chrome certificate viewer and the SHA-256 certificate fingerprint format used on crt.sh.

You can compute it with `xray tls hash --cert <cert.pem>`, or with `openssl x509 -noout -fingerprint -sha256 -in cert.pem`. `xray tls ping` also prints the SHA-256 hash of the remote certificate.

This check overrides normal certificate validation. There are two cases:

- If the core finds that the matching hash belongs to a leaf certificate, verification succeeds immediately.
- If the core finds that the matching hash belongs to a CA certificate, whether root or intermediate, it uses the value in `serverName` to verify that the leaf certificate is signed by that CA.

Client-only. The SNI used for certificate verification. Multiple domain names can be separated with `,`; it is enough for any one SAN in the certificate to match one of them. This overrides the `serverName` used for verification and is intended for special cases such as domain fronting.

Special value `"FromMitM"` causes Xray to additionally include the SNI extracted from TLS decrypted by a `dokodemo-door` inbound.

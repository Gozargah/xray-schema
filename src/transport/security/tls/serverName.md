Server name. The server certificate's SAN must contain this value. It can be a domain name or an IP address. If it is a domain name, it will be sent in the SNI extension of the Client Hello. IP addresses will not send the SNI extension, because SNI does not allow IP addresses. If you fill in an IPv6 address, wrap it in `[]`.

When left empty, the value in `address` is used automatically if that value is a domain name.

Special value `"FromMitM"` causes Xray to use the SNI extracted from TLS decrypted by a `dokodemo-door` inbound.

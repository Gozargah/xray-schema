Certificate usage. The default value is `"encipherment"`.

- `"encipherment"`: the certificate is used for TLS authentication and encryption
- `"verify"`: the certificate is used to verify remote TLS certificates; in this case it must be a CA certificate
- `"issue"`: the certificate is used to issue other certificates; in this case it must also be a CA certificate

### TIP

On Windows, you can install a self-signed CA certificate into the system store to verify remote TLS certificates.

### TIP

When a new client request arrives, suppose the specified `serverName` is `"xray.com"`. Xray first looks through the certificate list for a certificate usable for `"xray.com"`. If none is found, it uses any certificate whose `usage` is `"issue"` to issue one suitable for `"xray.com"` with a one-hour validity period, then adds that new certificate to the list for later use.

### TIP

You can generate a self-signed CA certificate with `xray tls cert`.

### TIP

If you already own a domain name, you can conveniently obtain free third-party certificates with tools such as [acme.sh](https://github.com/acmesh-official/acme.sh).

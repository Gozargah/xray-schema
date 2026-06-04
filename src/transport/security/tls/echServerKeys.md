Server-only parameter used to enable Encrypted Client Hello on the server.

Use `xray tls ech --serverName example.com` to generate an ECH Server Key and its corresponding Config. `example.com` is the SNI exposed to the outside when SNI is encrypted, and can be any value. The Server Key includes the ECHConfig. If you lose the client-side Config, you can recover it with `xray tls ech -i "your server key"`. You can publish it in a DNS HTTPS record; see the format in RFC 9460.

Note that after ECH is configured, the server still accepts normal non-ECH connections.

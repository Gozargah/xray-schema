Client-only parameter that configures ECHConfig. A non-empty value means the client enables Encrypted Client Hello. Two formats are supported.

The first is a fixed ECHConfig string.

The second is querying a DNS server. For example, when using a CDN, you can dynamically obtain ECHConfig from HTTPS records. If a valid ECH Config is obtained, Xray obeys the TTL returned by the server. The query target is the configured SNI, or the configured server domain name if SNI is empty and the target is a domain name.

The basic format is `"udp://1.1.1.1"`, meaning query ECHConfig through UDP DNS 1.1.1.1. You can also use `"https://1.1.1.1/dns-query"` or `h2c://` to query via DoH or h2c. All of these support an explicit port, such as `udp://1.1.1.1:53`. If omitted, the default port is 53 or 443 according to the protocol.

You can also specify a dedicated domain for the ECHConfig lookup in the form `"example.com+https://1.1.1.1/dns-query"`. In that case Xray forcibly uses the ECHConfig from the DNS records of `example.com` for the connection. This is useful if you want to obtain ECHConfig from DNS without exposing that you are querying the target domain's HTTPS record, or when you do not want to publish HTTPS records under that domain.

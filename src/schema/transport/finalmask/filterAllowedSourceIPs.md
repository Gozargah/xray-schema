Source IP allowlist. When non-empty, the source IP must be available and match at least one entry to be allowed.

Both fields support GeoIP entries (such as `geoip:cn`) and IPv4 and IPv6 CIDR ranges, with usage similar to [IP matching in routing rules](https://xtls.github.io/en/config/routing.html#ruleobject).

When both lists are configured, the source IP is allowed only if it matches the allowlist and does not match the blocklist.

IP address mask. When enabled, it automatically replaces IP addresses appearing in the log to protect privacy when sharing logs.

The default is `'empty'` (disabled).

Currently, the available levels are `'quarter'`, `'half'`, and `'full'`.

The masking formats correspond as follows:

- ipv4: `1.2.*.*` , `1.*.*.*` , `[Masked IPv4]`
- ipv6: `1234:5678::/32` , `1234::/16` , `[Masked IPv6]`

For more specific requirements, you can use a custom format such as `/16+/32`. The format defines the number of bits to keep unmasked; the first number is for IPv4 and the second for IPv6. Note that the IPv4 value must be divisible by 8. Using /32 (IPv4) or /128 (IPv6) means no masking, while /0 will display as `[Masked IPv4/IPv6]`.

Help us improve this page on GitHub!

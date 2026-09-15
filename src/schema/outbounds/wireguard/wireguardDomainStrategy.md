Controls the domain resolution strategy when the WireGuard server address or the target address of the proxied traffic is a domain name.

Unlike most proxy protocols, WireGuard does not allow domain names to be passed as targets. If the incoming target is a domain name, it must therefore be resolved to an IP address before transmission. The meanings of this field match the corresponding `Force` strategies in [sockopt.domainStrategy](https://xtls.github.io/en/config/transports/sockopt.html#sockoptobject). The default is `ForceIP`.

`sockopt.domainStrategy` includes options such as `UseIP`, which are not available here because WireGuard must obtain a usable IP address and cannot fall back to a domain name when `UseIP` resolution fails.

Note: When applied to proxied traffic, this option is also constrained by `address`. For example, if you set `ForceIPv6v4` but do not configure an IPv6 address in `address`, AAAA records will not be resolved even if the target domain has them.

Controls the domain resolution strategy when the Wireguard server address is a domain name or the target address of the proxied traffic is a domain name.

Unlike most proxy protocols, Wireguard does not allow passing domain names as targets. Therefore, if the incoming target is a domain name, it must be resolved to an IP before transmission. The meanings of this field match the corresponding `Force` strategies in [sockopt.domainStrategy](https://xtls.github.io/en/config/transports/sockopt.html#sockoptobject). The default value is `ForceIP`.

`sockopt.domainStrategy` includes options like `UseIP`, which are not provided here because Wireguard must obtain a usable IP and cannot perform the behavior of falling back to a domain name after `UseIP` resolution fails.

Note: When applied to proxied traffic, this option is also constrained by the `address` option. For example, if you set `ForceIPv6v4` but no IPv6 address is set in `address`, even if the target domain has AAAA records, they will not be resolved/used.

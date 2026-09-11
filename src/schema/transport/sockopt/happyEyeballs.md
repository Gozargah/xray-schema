An RFC 8305 Happy Eyeballs implementation, TCP only.

When the target is a domain name, it races the resolved addresses and chooses the first successful one. It only works when `sockopt.domainStrategy` is not `AsIs`.

Note that `UseIPv4v6` and `ForceIPv4v6` effectively reduce the usable IP list to IPv4 and switch to resolving IPv6 only if IPv4 resolution returns an error or no IP addresses. Failure to connect over IPv4 does not trigger this fallback. This usage is not recommended. Prefer `UseIP` or `ForceIP` together with `happyEyeballs.interleave`.

### WARNING

Do not use this feature together with `dialerProxy`, because that prevents `happyEyeballs` from taking effect.

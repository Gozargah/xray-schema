Matches Freedom final outbound rules in order, and allows or blocks connection targets.

Compared with blocking in `routing`, `finalRules` applies at Freedom's final outbound stage: matching happens after the final IP is resolved and before dialing; in addition, UDP is also matched packet by packet during send and receive, making it stricter and more thorough. Each rule match takes about 50-150 ns.

Note: whenever Freedom needs to apply `finalRules`, if `domainStrategy` is `AsIs` and the target is a domain, Freedom still resolves the target to an IP through the operating system DNS before matching rules. At that point the target is no longer a domain, so the later `sockopt.domainStrategy` and its `happyEyeballs` no longer take effect.

### WARNING

There is a default fallback safety policy for server-side and reverse-proxy scenarios:

If no explicit rule matches, the built-in fallback rule is used: traffic from the VLESS reverse proxy blocks all targets by default; traffic from `VLESS`, `VMess`, `Trojan`, `Shadowsocks`, `Hysteria`, or `WireGuard` inbounds blocks private and reserved IP ranges by default; other traffic is fully allowed by default.

If the server needs to allow clients to access some internal services, explicitly configure `allow` rules and limit them to the necessary `network`, `ip`, and `port` whenever possible.

If the server also needs features that rely on passing the domain to `sockopt` (such as `sockopt.domainStrategy` or `happyEyeballs`), it cannot continue relying on this default safety policy. You can configure the first rule as an `allow` rule without any matching conditions to restore the previous behavior; this is also equivalent to disabling this default safety policy, so evaluate the security impact yourself.

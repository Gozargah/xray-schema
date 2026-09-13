Matches Freedom final outbound rules in order, and allows or blocks connection targets.

Compared with blocking in `routing`, `finalRules` applies at Freedom's final outbound stage, both before and after dialing. UDP is also checked packet by packet during send and receive, making enforcement stricter and more thorough. Each rule match takes about 50-150 ns, so performance is not a concern.

::: details When the target is a domain name
When the target is a domain name and rules need to be applied, Freedom resolves it according to `sockopt.domainStrategy` before dialing, then checks every returned IP against the rules in order. If any IP is blocked, the entire request is blocked.

After dialing succeeds, Freedom checks the actual remote IP of the connection against the rules again. Therefore, if resolution before dialing fails or the two resolutions return different results, TCP handshake packets may still be sent before the connection enters the blackhole state.

Each UDP packet addressed to a domain name also triggers domain resolution when sent. However, the per-packet check only matches the destination IP selected for that packet against the rules in order to decide whether to block it; it does not check every IP returned by resolution.
:::

::: tip
If `sockopt.dialerProxy` is configured for this outbound, Freedom is no longer the final outbound, so it does not apply `finalRules` or the default safety policy described below.
:::

### WARNING

There is a default fallback safety policy for server-side and reverse-proxy scenarios:

If no explicit rule matches, the built-in fallback rule is used: traffic from the VLESS reverse proxy blocks all targets by default; traffic from `VLESS`, `VMess`, `Trojan`, `Shadowsocks`, `Hysteria`, or `WireGuard` inbounds blocks private and reserved IP ranges by default; other traffic is fully allowed by default.

If the server needs to allow clients to access some internal services, explicitly configure `allow` rules and limit them to the necessary `network`, `ip`, and `port` whenever possible.

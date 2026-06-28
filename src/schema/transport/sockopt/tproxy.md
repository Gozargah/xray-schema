Whether to enable transparent proxying. Linux only.

- `"redirect"`: transparent proxy in Redirect mode, supporting all IPv4 and IPv6 TCP connections
- `"tproxy"`: transparent proxy in TProxy mode, supporting all IPv4 and IPv6 TCP and UDP connections
- `"off"`: disable transparent proxying

Transparent proxying requires root or `CAP_NET_ADMIN`.

### DANGER

When `Dokodemo-door` has `followRedirect` set to `true`, and `tproxy` is empty in Sockopt, the `tproxy` value is set to `"redirect"`.

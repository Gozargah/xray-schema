Controls how Mux handles proxied UDP/443 (QUIC) traffic:

- Default `reject`: Rejects traffic (browsers typically fall back to TCP HTTP2 automatically).
- `allow`: Allows traffic to go through the Mux connection.
- `skip`: Does not use the Mux module to carry UDP 443 traffic. The proxy protocol's original UDP transmission method will be used. For example, `Shadowsocks` will use native UDP, and `VLESS` will use UoT.

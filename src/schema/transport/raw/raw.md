Renamed from the former TCP transport layer (as the original name was ambiguous), the outbound RAW transport layer directly sends TCP or UDP data wrapped by the proxy protocol. The core does not use other transport layers (such as [XHTTP](https://github.com/XTLS/Xray-core/discussions/4113)) to carry its traffic.

It can be combined with various protocols in multiple modes.

[Documentation ↗](https://xtls.github.io/en/config/transports/raw.html)

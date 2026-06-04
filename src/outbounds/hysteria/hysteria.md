Client implementation of the Hysteria protocol.

This page is very simple because the Hysteria protocol is actually composed of a simple proxy control protocol and a tuned QUIC transport implementation. In Xray, the proxy protocol and transport configuration are separated. For more details (such as `brutal`), please refer to transport configuration items [hysteriaSettings](https://xtls.github.io/en/config/transports/hysteria.html) and [FinalMask.quicParams](https://xtls.github.io/en/config/transports/finalmask.html#quicparams).

### TIP

The `hysteria protocol` itself has no authentication. When using with a non `hysteria` transport layer, it will be unable to proxy `udp`, and using it with other transport layers is not recommended.

[Documentation ↗](https://xtls.github.io/en/config/outbounds/hysteria.html)

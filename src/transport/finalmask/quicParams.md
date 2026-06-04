Used for QUIC parameter tuning in XHTTP H3 and Hysteria.

Fields:

- `congestion`: congestion-control algorithm. Supported values are `reno`, `bbr`, `brutal`, and `force-brutal`.
- `debug`: enable logging for the `bbr` and `brutal` congestion-control implementations.
- `brutalUp`: upload rate limit. The default is `0`.
- `brutalDown`: download rate limit. The default is `0`.
- `udpHop`: UDP port-hopping configuration.
- `initStreamReceiveWindow`: low-level QUIC stream receive window.
- `maxStreamReceiveWindow`: low-level QUIC stream receive window.
- `initConnectionReceiveWindow`: low-level QUIC connection receive window.
- `maxConnectionReceiveWindow`: low-level QUIC connection receive window.
- `maxIdleTimeout`: maximum idle timeout in seconds.
- `keepAlivePeriod`: QUIC KeepAlive interval in seconds.
- `disablePathMTUDiscovery`: whether to disable path MTU discovery.
- `maxIncomingStreams`: server-side maximum incoming streams.

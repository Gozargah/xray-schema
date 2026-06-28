Flow control mode, used to select the XTLS algorithm.

Currently, the following flow control modes are available in the outbound protocol:

- **No `flow` or empty string**: Use standard TLS proxy.
- **`xtls-rprx-vision`**: Use XTLS, including inner handshake random padding. Will intercept UDP traffic targeting port 443 (QUIC) to force browsers to use standard HTTPS, increasing traffic that can be Spliced.
- **`xtls-rprx-vision-udp443`**: Same as `xtls-rprx-vision`, but does not intercept UDP 443. Used when a program forces the use of QUIC and would fail to work if intercepted.

XTLS is available only in the following combinations:

- **TCP+TLS/REALITY**: In this case, if transmitting TLS 1.3, the core will attempt to Splice encrypted data at the bottom layer. If successful, it saves all core IO overhead.

### TIP

Splice is a function provided by the Linux Kernel. The system kernel forwards TCP directly, no longer passing through Xray's memory, greatly reducing data copying and CPU context switching.

When using Vision mode, Splice is automatically enabled if the following conditions are met:

- Linux environment.
- Inbound protocol is a pure TCP connection like `Dokodemo door`, `Socks`, `HTTP`, or other inbound protocols using XTLS.
- Outbound protocol is Trojan + XTLS.

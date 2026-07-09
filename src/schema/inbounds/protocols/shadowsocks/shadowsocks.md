The [Shadowsocks](https://zh.wikipedia.org/wiki/Shadowsocks) protocol, compatible with most other version implementations.

Current compatibility is as follows:

- Supports TCP and UDP packet forwarding, where UDP can be optionally disabled;
- Recommended encryption methods:
  - 2022-blake3-aes-128-gcm
  - 2022-blake3-aes-256-gcm
  - 2022-blake3-chacha20-poly1305
- Other encryption methods:
  - aes-256-gcm
  - aes-128-gcm
  - chacha20-poly1305 (or chacha20-ietf-poly1305)
  - xchacha20-poly1305 (or xchacha20-ietf-poly1305)

The Shadowsocks 2022 new protocol format improves performance and includes complete replay protection, resolving the following security issues of the old protocol:

- [Severe vulnerabilities in the design of Shadowsocks AEAD encryption, unable to guarantee communication reliability](https://github.com/shadowsocks/shadowsocks-org/issues/183)
- The false positive rate of the original TCP replay filter increases over time
- No UDP replay protection
- TCP behavior that can be used for active probing

[Documentation ↗](https://xtls.github.io/en/config/inbounds/shadowsocks.html)

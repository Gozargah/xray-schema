The MTU of the inner IP packets carried by the WireGuard tunnel. The default is 1420.

The structure of a WireGuard packet is as follows:

- 20-byte IPv4 header or 40 byte IPv6 header
- 8-byte UDP header
- 4-byte type
- 4-byte key index
- 8-byte nonce
- N-byte encrypted data
- 16-byte authentication tag

`N-byte encrypted data` is the MTU value. Depending on whether the endpoint uses IPv4 or IPv6, the value can be 1440 (IPv4) or 1420 (IPv6). Reduce it further for special network environments if necessary (for example, subtract an additional 8 bytes for home broadband using PPPoE).

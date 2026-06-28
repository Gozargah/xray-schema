MTU size of the underlying Wireguard tun.

The structure of a Wireguard packet is as follows:

- 20-byte IPv4 header or 40 byte IPv6 header
- 8-byte UDP header
- 4-byte type
- 4-byte key index
- 8-byte nonce
- N-byte encrypted data
- 16-byte authentication tag

`N-byte encrypted data` is the MTU value we need. Depending on whether the endpoint is IPv4 or IPv6, the specific value can be 1440 (IPv4) or 1420 (IPv6). If in a special environment, subtract further (e.g., home broadband PPPoE requires an extra -8).

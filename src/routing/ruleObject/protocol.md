An array, where each item represents a protocol. The rule takes effect when a protocol matches the protocol type of the current connection.

- `http` only supports 1.0 and 1.1; h2 is not supported yet (plaintext h2 traffic is also very rare).

---

- `tls` TLS 1.0 ~ 1.3.

---

- `quic` Due to the complexity of this protocol, sniffing may sometimes fail.

---

- `bittorrent` Only has the most basic sniffing; may not work for much encrypted and obfuscated traffic.

---

You must enable the `sniffing` option in the inbound proxy to sniff the protocol type used by the connection.

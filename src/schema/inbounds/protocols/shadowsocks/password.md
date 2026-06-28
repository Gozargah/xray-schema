Required.

### Shadowsocks 2022

Uses a pre-shared key similar to WireGuard as the password.

Use `openssl rand -base64 <length>` to generate a key compatible with shadowsocks-rust. The length depends on the encryption method used:

- 2022-blake3-aes-128-gcm: 16
- 2022-blake3-aes-256-gcm: 32
- 2022-blake3-chacha20-poly1305: 32

In the Go implementation, 32-byte keys always work.

### Other encryption methods

Any string. There is no limit on password length, but short passwords are more likely to be cracked. It is recommended to use passwords of 16 characters or longer.

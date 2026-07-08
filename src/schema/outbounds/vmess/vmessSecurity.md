Encryption method. The client will use the configured encryption method to send data, and the server will automatically identify it without configuration.

- `"aes-128-gcm"`: Use AES-128-GCM algorithm.
- `"chacha20-poly1305"`: Use Chacha20-Poly1305 algorithm.
- `"auto"`: Default value. Automatically selected (uses aes-128-gcm encryption when the running framework is AMD64, ARM64, or s390x; uses Chacha20-Poly1305 encryption in other cases).

Note: `"auto"` only determines the AES hardware acceleration support status of the _client_. If the _server_ does not support AES hardware acceleration, you still need to manually set it to `chacha20-poly1305`. This is very important because Chacha20-Poly1305 takes about 48% more time than AES-128-GCM on platforms supporting AES acceleration, but on platforms _without_ AES acceleration, AES-128-GCM takes over 2000% more time than Chacha20-Poly1305.

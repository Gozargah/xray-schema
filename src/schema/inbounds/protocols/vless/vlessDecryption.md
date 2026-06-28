VLESS Encryption settings. Cannot be left empty; to disable, explicitly set it to `"none"`.

It is recommended for most users to use the `xray vlessenc` command to automatically generate this field to avoid configuration mistakes. The detailed configuration below is recommended for advanced users only.

Detailed configuration format is a string of blocks connected by dots, for example:

`mlkem768x25519plus.native.600s.100-111-1111.75-0-111.50-0-3333.ptjHQxBQxTJ9MWr2cd5qWIflBSACHOevTauCQwa_71U`

This document refers to the individual parts separated by dots as blocks.

- The 1st block is the handshake method. Currently, there is only `mlkem768x25519plus`. Requires the server and client to match.
- The 2nd block is the encryption method. Options are `native`/`xorpub`/`random`, corresponding to: raw format packets / raw format + obfuscated public key part / full random numbers (similar to VMess/Shadowsocks). Requires the server and client to match.
- The 3rd block is the session resumption ticket validity time. Format is `600s` or `100-500s`. The former will pick a random time between that duration and half of that duration (e.g., `600s` = `300-600s`); the latter manually specifies a random range.

Following this is padding. After the connection is established, the server sends garbage data to obfuscate length characteristics. This does not need to be the same as the client (the same part in the outbound is the padding sent from the client to the server). It is a variable-length part, formatted as `padding.delay.padding` + `(.delay.padding)*n`. Multiple paddings can be inserted, requiring a delay block between two padding blocks.

- The `padding` format is `probability-min-max`, e.g., `100-111-1111` means 100% probability of sending a padding with a length of 111~1111.
- The `delay` format is also `probability-min-max`, e.g., `75-0-111` means 75% probability of waiting for 0~111 milliseconds.

The first padding block has special requirements: it requires 100% probability and a minimum length greater than 0. If no padding exists, the core automatically uses `100-111-1111.75-0-111.50-0-3333` as the padding setting.

The last block is identified by the core as the parameter used to authenticate the client. It can be generated using `./xray x25519` (using the PrivateKey part) or `./xray mlkem768` (using the Seed part). It must correspond to the client. `mlkem768` is a post-quantum algorithm that prevents the private key from being cracked by quantum computers (in the future) to impersonate the server if client parameters are leaked. This parameter is only used for verification; the handshake process is post-quantum secure regardless, and existing encrypted data cannot be cracked by future quantum computers.

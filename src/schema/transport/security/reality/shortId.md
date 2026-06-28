Outbound client-side `shortId`.

One of the server-side `shortIds`.

Its length is 8 bytes, which means up to 16 hexadecimal characters in the range `0` to `f`. It may be shorter than 16 characters, and the core pads trailing zeroes automatically, but the number of characters must be even.

If the server-side `shortIds` contains an empty string, the client-side value may also be empty.

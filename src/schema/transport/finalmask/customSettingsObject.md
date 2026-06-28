`header-custom` settings object used by FinalMask.

It defines one packet layer entry with optional delay, random padding, packet encoding type, and fixed packet data.

Fields:

- `delay`: delay in milliseconds. When it is `0`, the data is sent together with the previous packet.
- `rand`: adds a specified number of random bytes. Conflicts with `packet`.
- `randRange`: range of random-byte values. The default is `0-255`.
- `type`: the type of `packet`. Supported values are `array`, `str`, `hex`, and `base64`. The default is `array`.
- `packet`: adds fixed data. Conflicts with `rand`.

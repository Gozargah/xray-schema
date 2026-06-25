The content of the packet to be sent based on the preceding `type`.

- When `type` is `rand`, this specifies the length of the random data. It can be a fixed value `"100"` or a floating range `"50-150"`.
- When `type` is `str`, this specifies the string to be sent.
- When `type` is `hex`, this specifies binary data in hex format.
- When `type` is `base64`, this specifies base64 encoded binary data.

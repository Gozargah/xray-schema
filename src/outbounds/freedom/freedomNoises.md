UDP noise, used to send some random data as "noise" before sending a UDP connection. Presence of this structure implies enablement. It might deceive sniffers, or it might disrupt normal connections. _Use at your own risk._ For this reason, it bypasses port 53 because that breaks DNS.

It is an array where multiple noise packets to be sent can be defined. A single element in the array is defined as follows:

`"type"`: Noise packet type. Currently supports `"rand"` (random data), `"str"` (user-defined string), `"base64"` (base64 encoded custom binary data).

`"packet"`: The content of the packet to be sent based on the preceding `type`.

- When `type` is `rand`, this specifies the length of the random data. It can be a fixed value `"100"` or a floating range `"50-150"`.
- When `type` is `str`, this specifies the string to be sent.
- When `type` is `hex`, this specifies binary data in hex format.
- When `type` is `base64`, this specifies base64 encoded binary data.

`"delay"`: Delay in milliseconds. After sending this noise packet, the core will wait for this time before sending the next noise packet or real data. Defaults to no wait. It is an [Int32Range](https://xtls.github.io/en/development/intro/guide.html#int32range) type.

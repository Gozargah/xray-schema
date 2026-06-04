A set of key-value configuration items used to control outgoing TCP fragmentation. In some cases, it can deceive censorship systems, such as bypassing SNI blacklists.

`"length"` and `"interval"` are both [Int32Range](https://xtls.github.io/en/development/intro/guide.html#int32range) types.

`"packets"`: Supports two fragmentation modes. `"1-3"` is TCP stream slicing, applied to the 1st through 3rd data writes by the client. `"tlshello"` is TLS handshake packet slicing.

`"length"`: Fragment packet length (byte).

`"interval"`: Fragment interval (ms).

When `interval` is 0 and `"packets": "tlshello"` is set, the fragmented Client Hello will be sent in one TCP packet (provided its original size does not exceed MSS or MTU causing automatic system fragmentation).

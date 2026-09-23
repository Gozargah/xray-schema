Fragment interval (ms). It is an [Int32Range](https://xtls.github.io/en/development/intro/guide.html#int32range) type.

When `interval` is 0 and `"packets": "tlshello"` is set, the fragmented Client Hello will be sent in one TCP packet (provided its original size does not exceed MSS or MTU causing automatic system fragmentation).

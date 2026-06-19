`packetSize`: [Int32Range](https://xtls.github.io/en/development/intro/guide.md#int32range)

When non-empty, enables Gecko obfuscation, which applies additional fragmentation-and-padding obfuscation to QUIC long-header packets (short-header packets use Salamander directly). `packetSize` specifies the fragment size, and its upper bound must not exceed 2048.

## The internal buffer size for each request, in KB. Note that multiple requests may be carried on the same connection via multiplexing (e.g., when using mux.cool or gRPC). This means that even if they share an underlying connection, their buffer pools are independent.

## When the internal buffer is larger than this value, the next write operation will only be performed after the internal buffer is sent out until it is less than or equal to this value.

## Note that for a UDP request, if a write attempt is made while the buffer is full, the write operation will not be blocked but discarded. If set too low or to 0, it may cause unexpected bandwidth waste.

Default values:

- On ARM, MIPS, MIPSLE platforms, the default value is `0`.
- On ARM64, MIPS64, MIPS64LE platforms, the default value is `4`.
- On other platforms, the default value is `512`.

---

The default value can be set via the environment variable `XRAY_RAY_BUFFER_SIZE`. Note that the unit in the environment variable is MB (setting the environment variable to 1 is equivalent to setting the config to 1024).

Idle keepalive period in seconds for H2/H3. Default is `0` (Chrome H2 45s or quic-go H3 10s).

This field cannot be a range; negative values are allowed (for example `-1` disables idle keepalives). Recommended to keep `0`.

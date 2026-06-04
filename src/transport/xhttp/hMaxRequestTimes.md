Maximum HTTP requests per TCP/QUIC connection. This counts HTTP requests (stream-one = 1, stream-up = 2, packet-up = N).

Default (when all XMUX fields are `0`) is `"600-900"`, randomized. Otherwise default is `0` (no limit).

Counting is not strict and GET retries may occur, so avoid setting the maximum too tightly.

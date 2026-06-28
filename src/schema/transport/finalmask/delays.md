Interval between fragments in milliseconds.

The n-th element of the array specifies how long to wait after sending the n-th fragment split from the current packet being processed; the last element keeps applying to all subsequent fragments split from that packet.

When it is `0` and `"packets": "tlshello"` is set, the fragmented Client Hello will be sent in a single TCP packet, as long as its original size does not exceed the MSS or MTU and the system does not fragment it automatically.

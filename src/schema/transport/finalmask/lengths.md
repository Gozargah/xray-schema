Fragment size in bytes.

The n-th element of the array specifies the expected length of the n-th fragment split from the current packet being processed; the last element keeps applying to all subsequent fragments split from that packet. Entries other than the last may be `0` (otherwise it causes infinite idling); for TCP stream slicing, it behaves as sending no data, while for tlshello, it behaves as sending an RFC-violating empty TLS record (tolerated by some implementations, but not Golang).

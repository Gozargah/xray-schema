Fragment size in bytes.

The n-th element of the array specifies the expected length of the n-th fragment split from the current packet being processed; the last element keeps applying to all subsequent fragments split from that packet. Entries other than the last may be `0`; when `0` is selected, no fragment is split out for that round — it just idles and waits out the corresponding delay before the next one.

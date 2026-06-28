Downlink capacity, i.e., the maximum bandwidth used by the host to receive data. The unit is MB/s. Note that it is Byte, not bit. Can be set to 0, representing a very small bandwidth.

Default value is `20`.

**TIP:**

`uplinkCapacity` and `downlinkCapacity` determine the transmission speed of mKCP. Taking a client sending data as an example, the client's `uplinkCapacity` specifies the speed of sending data, while the server's `downlinkCapacity` specifies the speed of receiving data. The actual speed will be the smaller of the two values.

It is recommended to set `downlinkCapacity` to a larger value, such as 100, and set `uplinkCapacity` to the actual network speed. When the speed is insufficient, you can gradually increase the value of `uplinkCapacity` until it is about twice the bandwidth.

The maximum sending window, in bytes. It is converted into a number of in-flight packets as `maxSendingWindow / mtu`, and therefore must not be smaller than `mtu`.

The default value is `2097152`.

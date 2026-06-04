The HTTP path used by HTTPUpgrade. Default value is `"/"`.

If the client path contains the `ed` parameter (e.g., `/mypath?ed=2560`), `Early Data` will be enabled to reduce latency. The value represents the threshold for the first packet length. If the first packet length exceeds this value, `Early Data` will not be enabled. The recommended value is 2560.

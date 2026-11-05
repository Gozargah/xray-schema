A traffic filter for access control. Currently, only filtering [inbound](https://xtls.github.io/en/config/inbound.html) traffic by source IP is supported (no effect on outbounds). UDP traffic is filtered packet by packet. All other configuration and behavior are the same as the [TCP version](https://xtls.github.io/en/config/transports/finalmask.html#filter).

Unless there is a specific reason otherwise, place `filter` at the outermost layer, as the last item in the array.

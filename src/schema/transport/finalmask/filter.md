A traffic filter for access control. Currently, only filtering [inbound](https://xtls.github.io/en/config/inbound.html) traffic by source IP is supported (no effect on outbounds). Filtering takes place after the TCP three-way handshake completes successfully.

Unless there is a specific reason otherwise, place `filter` at the outermost layer, as the last item in the array.

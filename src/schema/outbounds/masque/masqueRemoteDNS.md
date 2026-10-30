DNS servers used inside the tunnel when the target is a domain name. They must be IP addresses. Servers in the same address family as the address assigned by the server are preferred; if none of them match, all of them are used.

The default is `["1.1.1.1", "1.0.0.1", "2606:4700:4700::1111", "2606:4700:4700::1001"]`. To resolve domain names locally, use the outbound's `targetStrategy`.

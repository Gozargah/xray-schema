Optional values are "tcp", "udp", or "tcp,udp". The rule takes effect when the connection method matches.

Since the core obviously only supports TCP and UDP layer 4 protocols, a routing rule containing only `"network": "tcp,udp"` can be used as a "catch-all" to match any traffic. An example usage is placing it at the very end of all routing rules to specify the default outbound when no other rules match (otherwise the core defaults to the first outbound).

Of course, other ways that obviously match any traffic, such as specifying ports 1-65535, have a similar effect.

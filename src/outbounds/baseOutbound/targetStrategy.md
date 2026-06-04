If this outbound attempts to send a domain request, this controls whether it is resolved/how it is resolved to an IP before sending.

The default value is `AsIs`, meaning it is sent to the remote server as is. All parameter meanings are roughly equivalent to `domainStrategy` in [Sockopt](https://xtls.github.io/en/config/transports/sockopt.html#sockoptobject).

### TIP

This controls **proxied requests**. If the address of the outbound proxy server is a domain name, and you need to select a resolution strategy for the domain name itself, you should configure `domainStrategy` in [Sockopt](https://xtls.github.io/en/config/transports/sockopt.html#sockoptobject).

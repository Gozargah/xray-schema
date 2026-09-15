Applies to outbounds other than Freedom. Controls whether the target domain name in a proxied request is resolved locally to an IP and which resolution strategy is used.

The default value is `AsIs`, which sends the target domain name unchanged to the remote server. The strategies have essentially the same meanings as `domainStrategy` in [Sockopt](https://xtls.github.io/en/config/transports/sockopt.html#sockoptobject).

### TIP

This controls **proxied requests**. If the address of the outbound proxy server is a domain name, and you need to select a resolution strategy for the domain name itself, you should configure `domainStrategy` in [Sockopt](https://xtls.github.io/en/config/transports/sockopt.html#sockoptobject).

Freedom's domain resolution strategy should also be configured through `sockopt.domainStrategy`.

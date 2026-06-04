When the identifier of another outbound is specified, data sent by this outbound will be forwarded to the specified outbound for transmission.

### DANGER

This option conflicts with [Sockopt.dialerProxy](https://xtls.github.io/en/config/transports/sockopt.html#sockoptobject). Choose one as needed.

By default, this forwarding method **ignores** this outbound's own transport configuration (such as XHTTP, REALITY, or Sockopt), meaning the `streamSettings` of this outbound will not take effect.  
If you need forwarding that works together with `streamSettings`, please use `Sockopt.dialerProxy` instead or set `transportLayer` to `true` here.

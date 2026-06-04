VLESS minimalist reverse proxy configuration. It preserves the real source IP information from the public-facing side.

The existence of this item indicates that this outbound can be used as a VLESS reverse proxy outbound, and it will automatically establish a connection to the server to register the reverse proxy tunnel.

`tag` is the inbound proxy tag for this reverse proxy. When the server dispatches a reverse proxy request, it enters the routing system from the inbound using this tag, and the routing system routes it to the outbound you need.

The UUID used must be one that is also configured with `reverse` on the server side (see VLESS Inbound for details).

`sniffing` see [SniffingObject](https://xtls.github.io/en/config/inbound.html#sniffingobject), performs sniffing on requests entering through this reverse proxy.

### TIP

Full tutorial: [VLESS Reverse Proxy Examples](https://xtls.github.io/en/document/level-2/vless_reverse.html)

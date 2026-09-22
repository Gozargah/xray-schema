Freedom is a direct outbound protocol and usually the final endpoint for traffic: it receives TCP or UDP traffic from upstream, connects directly to the final destination, and sends and receives data.

### WARNING

This outbound has a default safety policy in server-side and reverse-proxy scenarios, which may block some targets. See `finalRules` below for how to allow them.

[Documentation ↗](https://xtls.github.io/en/config/outbounds/freedom.html)

Use the sniffed domain only for routing; the proxy destination address remains the IP. The default value is `false`.

This item requires `destOverride` to be enabled to work.

### TIP

When it is guaranteed that **the proxied connection can obtain correct DNS resolution**, using `routeOnly` while enabling `destOverride`, and setting the routing matching strategy `domainStrategy` to `AsIs`, allows for domain and IP traffic splitting without DNS resolution throughout the process. In this case, the IP used when matching IP rules is the original IP of the domain name.

An RFC 8305 Happy Eyeballs implementation for TCP connections.

When the target is a domain name, it races the resolved addresses and chooses the first successful one. It only works when `Sockopt.domainStrategy` is not `AsIs`.

### WARNING

Do not use this together with the `domainStrategy` on a `Freedom` outbound, because then `Sockopt` only sees the final IP after replacement.

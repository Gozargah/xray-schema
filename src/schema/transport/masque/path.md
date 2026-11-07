URI template path. The default is the RFC 9484 path `/.well-known/masque/ip/{target}/{ipproto}/`.

Only full tunnels are supported. `{target}` and `{ipproto}` (including query forms such as `{?target,ipproto}`) are filled in as `*`, other variables are not supported, and the path must start with `/`.

The inbound only accepts requests whose path is the same as this one and returns 404 for all other requests, so `path` must be the same on both sides.

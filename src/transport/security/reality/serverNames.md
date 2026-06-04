Required inbound (server-side) list of allowed `serverName` values for clients.

`*` wildcards are not supported.

Usually this should stay consistent with `target`. Valid values are any SNI accepted by the server according to the behavior of `target`, and typically refer to the SAN values on the returned certificate.

The list may contain an empty string `""`, meaning connections without SNI are accepted. In that case, the client-side `serverName` cannot be empty and should instead be filled with any valid IP address as a placeholder.

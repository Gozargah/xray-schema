Outbound client-side `serverName`.

One of the server-side `serverNames`.

The client can also set this to any IP address. In that case Xray sends a Client Hello without an SNI extension. To use this feature, the server-side `serverNames` must contain an empty string `""`.

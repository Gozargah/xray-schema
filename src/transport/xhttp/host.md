Host behavior matches other HTTP-based transports. Client send priority is `host` > `serverName` > `address`.

If the server sets `host`, it will verify the client value matches; otherwise it will not check.

`host` must not be set inside `headers`, and it is generally recommended to leave it unset unless needed.

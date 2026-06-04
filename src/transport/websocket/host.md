The host sent in the WebSocket HTTP request. Default value is empty. If the server-side value is empty, the host value sent by the client is not verified.

When this value is specified on the server side, or `host` is specified in `headers`, it will verify whether it matches the client request host.

Client priority for sending host: `host` > `headers` > `address`.

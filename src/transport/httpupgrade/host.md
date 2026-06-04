The host sent in the HTTP request of HTTPUpgrade. Default value is empty. If the server-side value is empty, the host value sent by the client is not verified.

When this value is specified on the server, or specified in `headers`, it will verify whether it is consistent with the host requested by the client.

Priority of the host sent by the client: `host` > `headers` > `address`.

When enabled, only the connection metadata will be used to sniff the destination address. At this time, sniffers other than `fakedns` will not be activated.

If disabled (using more than just metadata to infer the destination address), the client must send data first before the proxy server actually establishes a connection. This behavior is incompatible with protocols where the server must initiate the first message, such as the SMTP protocol.

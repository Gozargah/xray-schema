Whether to enable session resumption. It is disabled by default, and session resumption is only attempted when both the server and the client enable it.

If negotiation succeeds, certificates do not need to be transmitted during the handshake. This saves a tiny amount of handshake time, which is usually negligible.

Note that this is not TLS 0-RTT. `gotls` does not support that feature yet, so this does not reduce TLS handshake RTT.

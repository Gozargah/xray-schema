The network type that the server port listens on. Default value is `"tcp"`.

This is only for listening; it mainly affects native UDP transmission. Setting it to `"tcp"` does not mean the inbound will reject UDP proxy requests. UDP proxy requests can still be wrapped into TCP packets by Shadowsocks outbound features like UoT or mux.cool and sent to the server.

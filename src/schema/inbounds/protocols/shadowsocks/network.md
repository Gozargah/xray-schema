The network type that the server port **listens** on. The default value is `"tcp"`.

Note that this is only for listening; it mainly affects and controls the native UDP transmission of Shadowsocks. Setting it to `"tcp"` does not mean the inbound will reject UDP proxy requests, because UDP proxy requests can still be wrapped into TCP packets by XUDP in Mux.Cool and sent to the server.

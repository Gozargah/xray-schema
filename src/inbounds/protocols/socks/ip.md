When UDP is enabled, Xray needs to know the IP address of the local machine.

The IP address should be the address the client can use to reach the server when initiating a UDP connection. By default, it is the local IP used by the TCP connection.

If your machine has multiple IP addresses, be aware of the UDP listening behavior for `0.0.0.0` described in [Inbound Listening](https://xtls.github.io/en/config/inbound.html#inboundobject).

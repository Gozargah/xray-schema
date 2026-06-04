A reverse proxy can forward traffic from the server side to the client side, effectively performing reverse traffic forwarding.

This reverse proxy is a general-purpose reverse proxy (it does not limit the proxy protocol type). The configuration is more complex. Do not confuse it with the VLESS simplified reverse configuration (refer to the relevant sections in the VLESS inbound/outbound documentation).

Its underlying protocol is Mux.cool, but the direction is reversed: the server initiates requests to the client.

The general working principle of the reverse proxy is as follows:

- Assume there is a web server on Host A. This host does not have a public IP and cannot be accessed directly from the public internet. There is another Host B, which is accessible from the public internet. We need to use B as the entry point to forward traffic from B to A.
  - Configure Xray on Host B to receive external requests; this is called the `portal`.
  - Configure Xray on Host A to bridge the forwarding from B to the web server; this is called the `bridge`.

- `bridge`
  - The `bridge` actively establishes a connection to the `portal` to register a reverse tunnel. The destination address (domain) of this connection can be defined by the user.
  - After receiving public traffic forwarded by the `portal`, the `bridge` sends it intact to the web server on Host A. Naturally, this step requires configuration in the routing module.
  - Upon receiving a response, the `bridge` returns the response intact to the `portal`.

- `portal`
  - If the `portal` receives a request and the domain matches, it indicates response data sent by the `bridge`. This connection will be used to establish the reverse tunnel.
  - If the `portal` receives a request and the domain does _not_ match, it indicates a connection from a public user. This connection data will be forwarded to the bridge.

- The `bridge` performs dynamic load balancing based on traffic volume.

As mentioned above, the reverse proxy has [Mux](https://xtls.github.io/en/development/protocols/muxcool.html) enabled by default. Please do not enable Mux again on the outbounds used by it.

The reverse proxy function is currently in the testing stage and may have some issues.

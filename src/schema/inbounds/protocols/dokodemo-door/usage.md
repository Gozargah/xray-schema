## Usage

The "Arbitrary Door" has two main uses: one is for transparent proxy (see below), and the other is for mapping a port.

Sometimes some services do not support forward proxies like Socks5, and using Tun or Tproxy is overkill. If these services only communicate with a single IP and port (e.g., iperf, Minecraft server, Wireguard endpoint), you can use dokodemo-door.

In this case, the core will listen on the configured local address/port and forward it to the target address/port via the default outbound. Connecting to the local address/port is equivalent to connecting to the target via a proxy.

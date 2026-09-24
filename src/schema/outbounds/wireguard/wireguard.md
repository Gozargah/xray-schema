User-space WireGuard protocol implementation for establishing a WireGuard tunnel with a peer, encapsulating TCP/UDP requests routed to this outbound into IP packets and sending them through the WireGuard tunnel.

### DANGER

**The WireGuard protocol is not designed specifically for bypassing firewalls. If used as the outer layer to cross the firewall, its distinct characteristics may lead to the server being blocked.**

[Documentation ↗](https://xtls.github.io/en/config/outbounds/wireguard.html)

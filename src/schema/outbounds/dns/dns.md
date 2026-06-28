DNS is an outbound protocol used to receive DNS queries sent in by routing, then forward or process them according to rules.

This outbound only supports traditional plaintext DNS queries over UDP and TCP; non-plaintext DNS protocols such as DoH, DoT, and DoQ are not applicable to this outbound. Common scenarios include TUN, transparent proxy, or `dokodemo-door` receiving DNS traffic and then routing sending that traffic to this outbound.

It can allow queries to the target DNS server, `hijack` them to the built-in [DNS server](https://xtls.github.io/en/config/dns.html) for further processing, drop them, or return responses with a specified RCODE according to rules. It can also rewrite the target address, port, and transport protocol.

[Documentation ↗](https://xtls.github.io/en/config/outbounds/dns.html)

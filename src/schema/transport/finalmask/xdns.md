Uses DNS queries to transmit data, similar to DNSTT. It performs standard DNS queries to carry payloads and supports TXT, A, and AAAA query types.

Because of technical limitations, the effective MTU is very small, QUIC cannot be used, and pairing it with mKCP is recommended. Recommended MTU values are 130 on the client side; on the server side, use 900 for TXT, which carries almost raw byte data, reduce appropriately to below 1/2 for AAAA, and below 1/8 for A. The theoretical encoding efficiency differs, while actual results depend on how many AAAA or A records intermediate forwarders tolerate in responses.

Since the queries are standard, they can be forwarded through any UDP DNS server, although the efficiency may be quite poor.

To use this feature, the server needs to listen on port 53, then the proxy protocol should point to a DNS server such as `8.8.8.8:53`, and you must own one of the domains in `domains`, then point its NS record to the server.

For example, if you own `example.com`, set an A record like `a.example.com` to the server IP, set an NS record like `t.example.com` to `a.example.com`, and then use `t.example.com`. The host used for the A record must not be a subdomain of the host used for the NS record.

Compatible only with kcp; a TTI of 200 is recommended. MTU configuration is required only on the server side (refer to MTU settings). CNAME calculation is relatively complex; values generally fall between those for AAAA and TXT records:

- When edns0 is 512: A 39, TXT 215, AAAA 117
- When edns0 is 1232: A 174, TXT 932, AAAA 492

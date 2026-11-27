Uses DNS queries to transmit data, similar to DNSTT. The client sends standard DNS queries carrying the payload to the resolvers in `resolvers`, which pass them on to the server as the name server of a domain in `domains`; the server answers with TXT, CNAME, A or AAAA records. Any DNS resolver can be used, over UDP, TCP or DoH, although the efficiency may be quite poor.

To use it, own a domain such as `example.com`: set an A record like `a.example.com` to the server IP and an NS record like `t.example.com` to `a.example.com`, then use `t.example.com` in `domains` on both sides, with the server listening on port 53. The host used for the A record must not be a subdomain of the host used for the NS record.

It only works with mKCP, as QUIC cannot be used; a TTI of 200 is recommended. Only the server needs its mKCP MTU set, to what one answer carries, as the client splits its packets over several queries. That depends on `edns0` and the record type, with CNAME between AAAA and TXT; set it for the smallest type the client uses, as a packet that does not fit the answer is dropped:

- When edns0 is 512: A 39, TXT 215, AAAA 117
- When edns0 is 1232: A 174, TXT 932, AAAA 492

For A and AAAA, it also depends on how many records the resolvers in between allow in one answer.

Each query uses a random one of the client's `names` and `types`. TXT, the client's default, carries the most per answer.

- `lenLimit` and `labelLimit` cap the length of the query names and of their labels, for resolvers that reject long ones.
- `alphabet` replaces base32 (`a`-`z`, `2`-`7`) in query names with 32 characters from `a`-`z` and `0`-`9`, each once, in any letter case; it has to be the same on the client and the server. Where names that look like base32 are blocked, use one with all of `0`, `1`, `8` and `9`, which base32 lacks, so that few names still look like base32.
- `resolvers` (client): `udp://`, the default, and `tcp://` use port 53 by default; `https://` is DoH, with POST requests and no User-Agent. `worker` is the number of connections for `tcp://`, and of requests at once for `https://`.
- `tlsConfig`, required for `https://`, is a [TLSObject](https://xtls.github.io/en/config/transports/tls.html#tlsobject): the Client Hello is Chrome's unless `fingerprint` says otherwise, and `serverName` can differ from the URL's host, which stays the HTTP Host, e.g. for domain fronting. With `alpn` set to `["h3"]` alone, DoH uses HTTP/3, set by `quicConfig`, a [quicParams](https://xtls.github.io/en/config/transports/finalmask.html#quicparams) that mimics Chrome by default; otherwise HTTP/2 over TLS.
- `extraPoll` (client): the server can only send data in answers, so the client sends this many extra empty queries after each one, which can speed up the download at the cost of more queries.

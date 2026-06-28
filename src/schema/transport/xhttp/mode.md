`mode` controls how XHTTP uploads. For maximum compatibility with middleboxes/CDNs, use `"packet-up"`.

Default `auto` behavior:

- Client: TLS H2 uses `stream-up`; REALITY uses `stream-one` (but uses `stream-up` when `downloadSettings` is present); otherwise uses `packet-up`.
- Server: accepts all three modes by default. If set to a specific mode, it only accepts that mode, except `"stream-up"` also accepts `"stream-one"`.

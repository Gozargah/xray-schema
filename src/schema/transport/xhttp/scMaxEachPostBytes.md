Packet-up only. Maximum bytes per POST. Default is `1000000` (1 MB). Must be smaller than the CDN/middlebox maximum; the server rejects larger posts.

Supports a range string (for example `"500000-1000000"`) to randomize per request.

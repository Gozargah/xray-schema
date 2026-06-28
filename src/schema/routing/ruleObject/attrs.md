A JSON object where keys and values are strings. Used to detect HTTP traffic attribute values (due to obvious reasons, only supports 1.0 and 1.1). The rule is matched when HTTP headers contain all specified keys and values contain the specified substrings. Keys are case-insensitive. Values support regular expressions.

It also supports pseudo-headers like `:method` and `:path` from h2 for matching methods and paths (although these headers do not exist in HTTP/1.1).

For non-CONNECT methods of HTTP inbounds, `attrs` can be obtained directly. For other inbounds, sniffing must be enabled to obtain these values for matching.

Example:

- Detect HTTP GET: `{":method": "GET"}`
- Detect HTTP Path: `{":path": "/test"}`
- Detect Content Type: `{"accept": "text/html"}`

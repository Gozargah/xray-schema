Only applies to the four HTTP-based transport methods: `XHTTP`, `WebSocket`, `HTTPUpgrade`, and `gRPC`. It controls whether to trust the XFF (`X-Forwarded-For`) header, that is, whether to treat it as coming from a trusted reverse proxy.

Xray checks whether the headers corresponding to the strings in this array are present in the request. If any one of them is present, regardless of its value, Xray allows the value at index 0 in the XFF header to override the source IP; otherwise, it ignores the XFF header.

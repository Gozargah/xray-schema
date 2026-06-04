Header padding length for request and response headers. Default range is `"100-1000"`, randomized per request/response.

Request padding is included in `Referer: ...?x_padding=...` and response padding is in `X-Padding`.

In packet-up mode, the Referer padding can produce long logs; consider suppressing those logs in reverse proxies.

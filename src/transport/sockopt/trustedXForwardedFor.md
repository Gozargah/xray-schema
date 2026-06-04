Only applies to the three HTTP-based inbounds: `XHTTP`, `WebSocket`, and `HTTPUpgrade`.

It controls when Xray trusts `X-Forwarded-For` and uses it to overwrite `SourceIP`.

If left unset, the old behavior remains: as long as the request contains `X-Forwarded-For`, Xray reads it.

After setting this field, each array item is treated as an additional required header name. Xray trusts `X-Forwarded-For` only when the request also contains at least one of those headers. The header values do not matter; only the presence of the key is checked.

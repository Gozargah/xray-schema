DNS server timeout in milliseconds. Default is 4000 ms.

This does not affect `localhost` DNS (system DNS), which always follows Golang's DNS timeout behavior (cgo and pure go may differ slightly).

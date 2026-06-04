`true` disables DNS caching. Defaults to `false` (not disabled).

This does not affect `localhost` DNS (system DNS), which always follows Golang's DNS caching behavior (cgo and pure go may differ slightly).

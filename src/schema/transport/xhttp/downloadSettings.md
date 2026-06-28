Client-only. Separate downstream `streamSettings` for upstream/downstream separation, with `address` and `port` pointing to another entry.

`network` must be `"xhttp"` and cannot be omitted. `security` must be `"tls"` or `"reality"`.

`xhttpSettings.path` must match the upstream `path`. Downstream settings are independent from upstream except for the `sockopt.penetrate` override behavior.

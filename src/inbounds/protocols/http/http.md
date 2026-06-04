HTTP protocol.

### DANGER

**The HTTP protocol does not encrypt traffic and is not suitable for transmission over the public internet. Using it exposes you to the risk of becoming a zombie for attacks.**

A more meaningful usage of `http` inbound is to listen within a LAN or on the local machine to provide local services for other programs.

### TIP 1

`http proxy` can only proxy the TCP protocol; UDP-based protocols are not supported.

### TIP 2

Use the following environment variables in Linux to enable a global HTTP proxy for the current session (supported by many software, but not all).

- `export http_proxy=http://127.0.0.1:8080/` (Address must be changed to your configured HTTP inbound proxy address)
- `export https_proxy=$http_proxy`

[Documentation ↗](https://xtls.github.io/en/config/inbounds/http.html)

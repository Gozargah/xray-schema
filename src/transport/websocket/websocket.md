Uses standard WebSocket to transport data.

WebSocket connections can be routed by other HTTP servers (such as Nginx) or by VLESS fallbacks path.

### DANGER

It is recommended to switch to [XHTTP](https://github.com/XTLS/Xray-core/discussions/4113) to avoid significant traffic characteristics like WebSocket "ALPN is http/1.1".

### TIP

WebSocket will recognize the `X-Forwarded-For` header in HTTP requests to overwrite the source address of the traffic, which has higher priority than the PROXY protocol.

[Documentation ↗](https://xtls.github.io/en/config/transports/websocket.html)

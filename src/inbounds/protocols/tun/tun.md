Creates a TUN interface; traffic sent to this interface will be processed by Xray. Currently, Windows, Linux, macOS, and FreeBSD are supported.

On Android, the TUN FD must be passed in from an external app, which uses VPN Service to redirect traffic. It cannot run standalone and only serves as a way for an app to feed traffic into Xray.

[Documentation ↗](https://xtls.github.io/en/config/inbounds/tun.html)

Creates a TUN interface; traffic sent to this interface will be processed by Xray. Currently, Windows, Linux, macOS, and FreeBSD are supported.

On Android and iOS, the TUN FD must be passed in from an external app via the `XRAY_TUN_FD` environment variable, which redirects traffic through the interface designated by the system. It cannot run standalone and only serves as a way for an app to feed traffic into Xray.

On Linux, this environment variable can optionally be used to pass in the TUN FD for certain lightweight or unprivileged implementations.

[Documentation ↗](https://xtls.github.io/en/config/inbounds/tun.html)

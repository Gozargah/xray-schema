[VMess](https://xtls.github.io/en/development/protocols/vmess.html) is an encrypted transport protocol, commonly acting as a bridge between the Xray client and server.

### DANGER

VMess depends on system time. Please ensure that the system UTC time of the device running Xray is within 120 seconds of the actual time, regardless of the time zone. On Linux systems, you can install the `ntp` service to automatically synchronize system time.

[Documentation ↗](https://xtls.github.io/en/config/inbounds/vmess.html)

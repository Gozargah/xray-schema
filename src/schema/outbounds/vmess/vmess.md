[VMess](https://xtls.github.io/en/development/protocols/vmess.html) is an encrypted transport protocol, usually serving as a bridge between the Xray client and server.

### DANGER

VMess depends on system time. Please ensure that the UTC time of the system running Xray is within 120 seconds of the actual time, independent of the time zone. On Linux systems, you can install the `ntp` service to automatically synchronize the system time.

[Documentation ↗](https://xtls.github.io/en/config/outbounds/vmess.html)

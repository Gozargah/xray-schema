REALITY configuration. REALITY is a modified form of TLS that uses the appearance and handshake characteristics of a target site as camouflage.

Only valid when `security` is `reality`. It can only be used together with the `RAW`, `XHTTP`, and `gRPC` transport methods.

### TIP

REALITY is currently one of the most secure transport-security schemes, and from the outside its traffic looks consistent with ordinary web traffic. Enabling REALITY together with a suitable XTLS Vision flow-control mode can also deliver performance gains of several times or even more than ten times.

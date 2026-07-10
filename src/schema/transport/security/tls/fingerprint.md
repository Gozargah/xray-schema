This parameter configures the fingerprint of the `TLS Client Hello`. The default value is `chrome`. To revert to native Go TLS, set it to `unsafe`. When enabled, Xray uses the uTLS library to simulate a TLS fingerprint, or generates one randomly. Three configuration styles are supported:

1. TLS fingerprints of the latest versions of common browsers:
   - `"chrome"`, `"firefox"`, `"safari"`, `"ios"`, `"android"`, `"edge"`, `"360"`, `"qq"`

2. Automatically generate a fingerprint when Xray starts:
   - `"random"`: randomly choose one from newer browser versions
   - `"randomized"`: generate a completely random unique fingerprint that fully supports TLS 1.3 with X25519

3. Use native uTLS hello names such as `"HelloRandomizedNoALPN"` or `"HelloChrome_106_Shuffle"`. See the full list in the [uTLS library](https://github.com/refraction-networking/utls/blob/master/u_common.go#L434).

### TIP

This feature only simulates the `TLS Client Hello` fingerprint. Behavior and other fingerprints remain the same as Go. If you want more complete browser-like TLS fingerprints and behavior, use Browser Dialer.

### TIP

When this feature is enabled, some TLS options that affect TLS fingerprints are overridden by the uTLS library and stop taking effect.
The parameters still passed through are: `"serverName" "disableSystemRoot" "pinnedPeerCertSha256" "masterKeyLog" "echConfigList" "echSockopt"`.

ALPN has special behavior.

By default, the most common `h2,http/1.1` is forced as ALPN. For WebSocket and HttpUpgrade transports, `http/1.1` is used by default — otherwise negotiating to `h2` would prevent the connection from succeeding — but you may manually set it to `h2,http/1.1` if you are sure the server supports completing the handshake with this ALPN.

If ECH is enabled, the outer ALPN is always shown as `h2,http/1.1`. The inner ALPN is forced to `http/1.1` for WebSocket or HttpUpgrade transports to allow the handshake to complete; for other protocols the user-configured ALPN is honored.

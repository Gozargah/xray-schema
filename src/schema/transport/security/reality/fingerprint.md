Required outbound client-side fingerprint.

Same as [TLSObject](https://xtls.github.io/en/config/transports/tls.html#tlsobject).

The fingerprint must support MLKEM; availability is guaranteed only for `chrome`, `firefox`, and `safari` fingerprints.

### TIP

When enabled, some TLS options that affect TLS fingerprints are overridden by the underlying uTLS behavior.

Required outbound client-side fingerprint.

Same as `TLSObject`. Note that `unsafe`, which disables uTLS for TLS, is not supported here because REALITY relies on that library to manipulate lower-level TLS parameters.

### TIP

When enabled, some TLS options that affect TLS fingerprints are overridden by the underlying uTLS behavior.

An array containing a series of powerful fallback configurations (optional). For specific configuration of fallbacks, see [FallbackObject](https://xtls.github.io/en/config/features/fallback.html#fallbackobject).

### TIP

Xray's Trojan has complete support for fallbacks, and the configuration method is exactly the same as VLESS. The conditions for triggering fallback are also similar to VLESS: the length of the first packet < 58, OR the 57th byte is not `\r` (because Trojan has no protocol version), OR authentication fails.

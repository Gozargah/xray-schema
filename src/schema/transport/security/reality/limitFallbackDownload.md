Optional rate limit for fallback REALITY connections that fail verification.

This object applies to download traffic.

The rate limiter starts after the specified number of bytes has been transmitted. The bucket capacity is `burstBytesPerSec`. Each transmitted byte consumes one token. The bucket starts full with `burstBytesPerSec` tokens and is refilled with `bytesPerSec` tokens every second until full.

### WARNING

Fallback rate limiting is itself a fingerprint and is not recommended unless you need it.

Initial window size for h2 Stream. When the value is less than or equal to `0`, this feature does not take effect. When the value is greater than `65535`, the Dynamic Window mechanism will be disabled. Default value is `0` (disabled).

### TIP

Only needs to be configured on outbound (client).

### TIP

When going through Cloudflare CDN, you can set the value to `65536` or higher (disabling Dynamic Window) to prevent Cloudflare CDN from sending unexpected h2 GOAWAY frames to close existing connections.

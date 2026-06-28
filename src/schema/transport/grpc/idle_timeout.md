Unit: seconds. When there is no data transmission during this period, a health check will be performed. If this value is set below `10`, `10` will be used (the minimum value).

### TIP

If you are not using reverse proxy tools like Caddy or Nginx (usually not), and set this below `60`, the server might send unexpected h2 GOAWAY frames to close existing connections.

Health checks are disabled by default.

### TIP

Only needs to be configured on outbound (client).

### TIP

May resolve some "disconnection" issues.

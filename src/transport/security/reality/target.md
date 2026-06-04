Required inbound (server-side) target destination.

The format is the same as VLESS fallback `dest`. The old name was `dest`; in current versions the two fields are aliases.

The core decides whether the current configuration is client-side or server-side based on whether this field exists. Do not fill it in on the client side, or it will cause incorrect detection.

If `target` supports the post-quantum key-exchange algorithm `X25519MLKEM768`, the REALITY client also automatically uses that algorithm for key negotiation.

You can check support with `xray tls ping cloudflare.com`, replacing the domain with your `target` and optionally including a port.

### WARNING

For camouflage reasons, Xray directly forwards traffic that fails authentication to `target`. If the IP address of the target site is special, your server may effectively become a port forwarder for that service and may be abused after scanning.

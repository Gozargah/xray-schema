`tag` is the outbound proxy tag for this reverse proxy. Routing traffic to this outbound using routing rules will forward it through the reverse proxy to the connected client's routing system (see VLESS outbound for client configuration details).

When multiple different connections (potentially from different devices) are connected, the core randomly selects one to dispatch reverse proxy data for each request.

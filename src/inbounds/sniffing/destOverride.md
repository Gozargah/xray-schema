When the traffic is of the specified type, reset the destination of the current connection based on the destination address contained within it.

### TIP

Xray will only sniff the domains of protocols in `destOverride` for routing purposes. If you only want to sniff for routing but do not want to reset the destination address (e.g., resetting the destination address when using the Tor browser will cause connection failure), please add the corresponding protocol here and enable `routeOnly`.

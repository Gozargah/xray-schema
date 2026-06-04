Traffic sniffing is mainly used for transparent proxies and similar purposes. A typical flow is as follows:

1. If a device accesses the internet and visits abc.com, the device first queries DNS to get the IP of abc.com as 1.2.3.4, and then the device initiates a connection to 1.2.3.4.
2. If sniffing is not configured, the connection request received by Xray is for 1.2.3.4, which cannot be used for routing traffic based on domain rules.
3. When `enabled` in sniffing is set to `true`, Xray will sniff the domain name, i.e., abc.com, from the traffic data when processing this connection.
4. Xray will reset 1.2.3.4 to abc.com. The routing can then divert traffic according to the domain rules.

Because it becomes a connection requesting abc.com, more things can be done. Besides routing domain rule diversion, it can also re-perform DNS resolution and other tasks.

When `enabled` in sniffing is set to `true`, it can also sniff Bittorrent type traffic. Then you can configure the `protocol` item in routing to set rules for handling unencrypted BT traffic. For example, the server side can be used to intercept unencrypted BT traffic, or the client side can fixedly forward BT traffic to a certain VPS, etc.

Note: Newer browsers may use ECH to encrypt the Client Hello. In this case, Xray can only see the domain in the Outer Hello. You may need to consider hijacking DNS or manually disabling ECH in the browser configuration.

[Documentation ↗](https://xtls.github.io/en/config/inbound.html#sniffingobject)

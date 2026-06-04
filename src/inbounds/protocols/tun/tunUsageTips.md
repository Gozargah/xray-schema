## Usage Tips

If `autoSystemRoutingTable` is not configured, you still need to add routes manually to direct traffic to the created TUN interface; otherwise, it remains just an interface.

When `gateway`, `dns`, `autoSystemRoutingTable`, and `autoOutboundsInterface` are configured, Xray can perform part of the system-side setup automatically on supported platforms. If your platform does not implement these automatic settings yet, or if you need more fine-grained policy routing, you still need to configure the OS manually.

If you only want to proxy specific process(es), the process name routing in the Xray routing system will be very useful.

### WARNING

Be aware of potential traffic loop issues. After setting routes, requests initiated by Xray might be sent back to Xray, causing a loop. Prefer `autoOutboundsInterface` to avoid this problem. If you need manual control, you can still use `interface` in `sockopt` to bind to the actual physical network interface. `ipconfig` (Windows) or `ip a` (Linux) will help you find the interface name you need. Alternatively, use the outbound `sendThrough` setting. It is available directly in `OutboundObject` without the deep nesting level of `sockOpt.interface`. Here you need to use the IP address on the network card, such as 192.168.1.2 (As you can see, its disadvantage is that it cannot automatically support dual-stack; please choose according to the IP actually used for your outbound connection).

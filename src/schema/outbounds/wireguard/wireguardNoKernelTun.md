Whether to forcibly disable system TUN regardless of automatic detection. The default is `false`; you may need to set it to `true` in LXC or Docker environments.

#### About kernel TUN

The way Xray restores WireGuard IP packets back into TCP/UDP payloads.
By default, Xray automatically detects: on Linux, if the Xray process has the `CAP_NET_ADMIN` capability, it creates a TUN interface and uses the kernel network stack; on other platforms or when permissions are insufficient, it uses the in-process gVisor network stack. When set to `true`, only the gVisor network stack is used and no TUN interface is created. Using TUN generally provides better performance.

The automatic detection described above is not always accurate. For example, some LXC environments may be unable to use TUN even when they have the `CAP_NET_ADMIN` capability, causing the outbound to fail; in this case, setting `noKernelTun` to `true` solves the problem.

This option only selects how inner IP packets are processed. The WireGuard protocol itself is still handled by Xray's user-space implementation and is unrelated to the kernel WireGuard module.

When TUN is used, it occupies IPv6 routing table 10230. Each additional WireGuard outbound uses the next routing table in sequence; for example, the second one uses routing table 10231, and so on.

If a second Xray instance is started on the same machine, it does not continue allocating routing table numbers. Instead, it also tries to use routing table 10230. Because that table is already occupied by the first Xray instance, the second instance cannot connect. If multiple instances are necessary, use this option to disable TUN.

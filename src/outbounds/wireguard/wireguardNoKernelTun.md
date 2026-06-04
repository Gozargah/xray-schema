By default, the core detects if it is running on Linux and if the current user has `CAP_NET_ADMIN` permissions to decide whether to enable the system virtual network interface; otherwise, it uses gVisor. Using the system virtual interface offers relatively higher performance. Note that this is only for processing IP packets and has nothing to do with the wireguard kernel module.

This detection may not always be accurate. For example, some LXC virtualization environments may not have TUN permissions at all, causing the outbound to fail. Therefore, you can set this option to manually disable it.

When using the system virtual interface, it occupies IPv6 routing table number `10230`. Each additional Wireguard outbound will use subsequent routing tables sequentially; for example, the second one will use routing table `10231`, and so on.

Note that if a second Xray instance is started on the same machine, it will not assign the next routing table number but will continue trying to use routing table `10230`. Since it is already occupied by the first Xray instance, it will fail to connect. If absolutely needed, you must set this option to disable the system virtual interface.

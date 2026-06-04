Use SRV records or TXT records to specify the target address and or port used by outbound. The default value is `none`, which disables the feature.

These lookups go through system DNS rather than Xray's built-in DNS. The queried name is the outbound domain name. If the lookup fails, the request is sent using the original address and port.

`Srv*` means querying SRV records in their standard format. `Txt*` means querying TXT records in a format such as `127.0.0.1:80`.

`PortOnly` resets only the port. `AddressOnly` resets only the address. `PortAndAddress` resets both.

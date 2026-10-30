An array, where each item represents an IP range. The rule takes effect when an item matches the target IP. Available forms:

- **IP**: Like `"127.0.0.1"`.
- **[CIDR](https://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing)**: Like `"10.0.0.0/8"`. You can also use `"0.0.0.0/0"` or `"::/0"` to specify all IPv4 or IPv6.
- **Predefined IP list**: This list is pre-installed in every Xray installation package, named `geoip.dat`, and is provided by [XTLS/Xray-rules-dat](https://github.com/XTLS/Xray-rules-dat). Usage is like `"geoip:cn"`. Must start with `geoip:` (lowercase), followed by a two-letter country code or another category name.
  - The lite version included by default contains only three country categories: `cn`, `ir`, and `ru`. Use the full version for categories for other countries or regions.
  - **Special value**: `"geoip:private"`, includes all private addresses, such as `127.0.0.1`.
- **Load IPs from file**: In the form of `"ext:file:tag"`. Must start with `ext:` (lowercase), followed by filename and tag. The file is stored in the [Resource Directory](https://xtls.github.io/en/config/features/env.html#resource-file-path). The file format is the same as `geoip.dat`, and the tag must exist in the file.
- **Inverse selection `!`**: `"!10.0.0.0/8"` means anything not in `10.0.0.0/8`, and `"!geoip:cn"` means results not in `geoip:cn`. Multiple inverse options have an `AND` relationship, while positive options, or positive options together with all inverse options, have an `OR` relationship. For example, `ip: ["!geoip:cn", "!geoip:ru", "geoip:telegram"]` matches IPs that are not from Russia AND not from China, OR are Telegram IPs.

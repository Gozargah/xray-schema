- **Pure string**: Same as substring below, but the `"keyword:"` prefix can be omitted.

---

- **Regular expression**: Starts with `"regexp:"`, the rest is a regular expression. The rule takes effect when the regular expression matches the target domain. For example, "regexp:\\.goo.\*\\.com$" matches "www.google.com" and "fonts.googleapis.com", but not "google.com". Case sensitive.

---

- **Subdomain (Recommended)**: Starts with `"domain:"`, the rest is a domain name. The rule takes effect when the domain is the target domain or its subdomain. For example, "domain:xray.com" matches "www.xray.com" and "xray.com", but not "wxray.com".

---

- **Substring**: Starts with `"keyword:"`, the rest is a string. The rule takes effect when this string matches any part of the target domain. For example, "keyword:sina.com" matches "sina.com", "sina.com.cn", and "www.sina.com", but not "sina.cn".

---

- **Full match**: Starts with `"full:"`, the rest is a domain name. The rule takes effect when this domain exactly matches the target domain. For example, "full:xray.com" matches "xray.com" but not "www.xray.com".

---

- **Dotless domain**: Starts with `"dotless:"`, the rest is a string that cannot contain .. The rule takes effect when the domain contains no `.` and this string matches any part of the target domain. For example, "dotless:pc-" matches "pc-alice", "mypc-alice". Suitable for intranet NetBIOS domains, etc. Case sensitive.

---

- **Predefined domain list**: Starts with `"geosite:"`, the rest is a name, such as `geosite:google` or `geosite:cn`. Refer to Predefined Domain List for names and domain lists.

---

- **Load domains from file**: In the form of `"ext:file:tag"`. Must start with `ext:` (lowercase), followed by filename and tag. The file is stored in the [Resource Directory](https://xtls.github.io/en/config/features/env.html#resource-file-path). The file format is the same as `geosite.dat`, and the tag must exist in the file.

---

- `"ext:geoip.dat:cn"` is equivalent to `"geoip:cn"`

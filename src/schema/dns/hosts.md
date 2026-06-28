## A static IP mapping. The value consists of entries in the form `"domain": "address"` or `"domain": ["address 1", "address 2"]`. Each address may be an IP or a domain name. When resolving a domain, the core will check all mapping entries and return all matched IP addresses. If nothing matches, the DNS query phase is entered.

## The mapping target may be a domain name. When the core finishes matching and the mapping contains domain name(s), the behavior is slightly different:

- If the mapping contains both IP addresses and domain names, the domain names are removed and only the IP addresses are returned.
- If the mapping contains several domain names, the result is ambiguous: the match fails, is treated as a miss, and the DNS query phase is entered.
- If the mapping contains exactly one domain name, that domain will be fed back into the Hosts module for recursive resolution, repeating the above steps with a maximum recursion depth of 5.
- If the above recursive resolution yields no IPs, and the final resolution result contains exactly one domain name, that domain replaces the original requested domain and is sent to the DNS query phase.

---

The matching format (`domain:`, `full:`, etc.) is the same as the domain in the commonly used [Routing System](https://xtls.github.io/en/config/routing.html#ruleobject). The difference is that without a prefix, it defaults to using the `full:` prefix (similar to the common hosts file syntax).

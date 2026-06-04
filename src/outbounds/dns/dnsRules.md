Matches DNS query rules in order, and supports fine-grained control by `qtype` and `domain`.

If no rule is matched, the built-in fallback rule is used: A and AAAA queries are imported into the built-in DNS module, while other query types return an empty response with RCODE `0`.

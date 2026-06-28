An array of strings. Each string is used for prefix matching against outbound identifiers. Among the following outbound identifiers: `[ "a", "ab", "c", "ba" ]`, `"selector": ["a"]` will match `[ "a", "ab" ]`.

Generally matches multiple outbounds to distribute load among them.

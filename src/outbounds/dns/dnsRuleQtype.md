Matches DNS query types. The forms are as follows:

- Integer value: a specific query type, such as `"qtype": 1` for an A query, or `"qtype": 28` for an AAAA query.
- String: can be a digits-only string such as `"qtype": "28"`, or a numeric range such as `"qtype": "5-10"`, which represents the 6 types from type 5 to type 10. Commas can be used for segmentation, such as `11,13,15-17`, which represents the 5 types: type 11, type 13, and type 15 to type 17.

For specific type numbers, refer to the [IANA documentation](https://www.iana.org/assignments/dns-parameters/dns-parameters.xhtml).

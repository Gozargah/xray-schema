## Corresponds to an array, where each item is a rule.

## For each connection, routing will judge these rules from top to bottom. When the first effective rule is encountered, the connection is forwarded to the `outboundTag` or `balancerTag` specified by it.

When no rule is matched, traffic is sent via the first outbound by default.

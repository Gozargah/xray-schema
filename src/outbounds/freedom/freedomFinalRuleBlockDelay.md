Sets how long the blackhole state lasts after a blocking rule matches.

When a rule's `action` is `block` and the target matches, Freedom puts the connection into a blackhole state and closes it after this duration expires. The unit is seconds. It can be written as a fixed value or a range, for example `30` or `30-90`. If omitted, it defaults to `30-90`, which means a random value within that range.

A TCP fragmentation layer.

Fields:

- `packets`: packet preset. Supported values are `1-3` and `tlshello`.
- `length`: packet length or range.
- `delay`: delay range in milliseconds.
- `maxSplit`: maximum split count range.

The project ships a snippet for `tlshello` with `100-200` length, `10-20` delay, and `3-6` max split.

A TCP fragmentation layer. In some cases it can deceive censorship systems, for example by bypassing SNI blacklists.

`"length"`, `"delay"`, and `"maxSplit"` are all Int32Range values.

Fields:

- `packets`: packet preset. Supported values are `1-3` and `tlshello`.
- `lengths`: fragment size in bytes (array).
- `delays`: interval between fragments in milliseconds (array).
- `maxSplit`: maximum number of splits. `0` means unlimited.

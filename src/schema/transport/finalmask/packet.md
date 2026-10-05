Adds fixed data. Conflicts with `rand`.

With `"type": "exp"`, `packet` is an expression string that builds one noise packet, generated again on every send, so it can carry changing content such as a timestamp. The parts of the expression are joined in order into a single packet:

- `<b hex>`: fixed bytes written as hex, an optional `0x` prefix is ignored
- `<r N>` or `<r A-B>`: `N` random bytes, or a random count between `A` and `B`
- `<rc N>` or `<rc A-B>`: the same with random letters (`a-zA-Z`)
- `<rd N>` or `<rd A-B>`: the same with random digits (`0-9`)
- `<t>`: the current Unix time in seconds, 4 bytes big endian
- `<c>`: a counter, 4 bytes big endian, increased by one each time
- `<n>`: 8 random bytes

For example with packet `<b 0d0a0d0a><t><r 24>` sends `\r\n\r\n`, the timestamp and 24 random bytes as one packet.

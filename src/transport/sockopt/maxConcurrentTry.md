Maximum number of concurrent attempts. This prevents the core from launching too many connections when a domain resolves to many addresses and all of them fail.

The default is `4`. Setting it to `0` disables Happy Eyeballs.

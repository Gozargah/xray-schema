UDP port-hopping configuration.

`ports` specifies the hopping range. It can be a single numeric string like `"1234"`, or a range like `"1145-1919"`, which means ports 1145 through 1919. Commas can be used to combine ranges, for example `11,13,15-17`.

`interval` is the port-hopping interval in seconds. The minimum is 5. The default is 30 seconds.

VLESS inbound allows the client to modify the 7th and 8th bytes of the configured UUID to any bytes. The server routing will use this as `vlessRoute` data, allowing users to customize parts of the server routing based on needs without changing any external fields.

```
--------------↓↓↓↓------------------
xxxxxxxx-xxxx-0000-xxxx-xxxxxxxxxxxx
```

The configuration uses data after Big-Endian encoding to uint16 (if you don't understand, treat these four digits as a hexadecimal number and convert to decimal). E.g., `0001→1`, `000e→14`, `38b2→14514`. The reason for this is that the syntax here is the same as `port`; you can freely specify many segments for routing just like specifying ports.

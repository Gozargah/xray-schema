User ID for VMess. It can be any string less than 30 bytes, or a valid UUID.

### TIP

A custom string and its mapped UUID are equivalent. This means you can identify the same user in the configuration file by writing the ID in either way.

Mapping standard: [VLESS UUID Mapping Standard: Mapping Custom Strings to UUIDv5](https://github.com/XTLS/Xray-core/issues/158).

Use `xray uuid -i "custom string"` to generate the mapped UUID, or `xray uuid` to generate a random UUID.

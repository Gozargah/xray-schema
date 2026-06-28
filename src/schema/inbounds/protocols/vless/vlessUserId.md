The user ID for VLESS. It can be any string less than 30 bytes or a valid UUID. A custom string and its mapped UUID are equivalent.

Mapping standard: [VLESS UUID Mapping Standard: Mapping Custom Strings to a UUIDv5](https://github.com/XTLS/Xray-core/issues/158).

Use `xray uuid -i "custom string"` to generate the mapped UUID, or `xray uuid` to generate a random UUID.

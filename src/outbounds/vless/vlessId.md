User ID for VLESS. It can be any string less than 30 bytes, or a valid UUID. A custom string and its mapped UUID are equivalent.

The mapping standard is described in [VLESS UUID Mapping Standard: Mapping Custom Strings to UUIDv5](https://github.com/XTLS/Xray-core/issues/158).

You can use the command `xray uuid -i "custom string"` to generate the UUID mapped from a custom string, or use the command `xray uuid` to generate a random UUID.

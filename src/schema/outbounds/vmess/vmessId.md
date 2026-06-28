VMess User ID. It can be any string less than 30 bytes or a valid UUID.

A custom string and its mapped UUID are equivalent. This means you can identify the same user in the configuration file like this:

- Write `"id": "我爱🍉老师1314"`,
- Or write `"id": "5783a3e7-e373-51cd-8642-c83782b807c5"` (This UUID is the UUID mapping of `我爱🍉老师1314`)

The mapping standard is described in [VLESS UUID Mapping Standard: Mapping Custom Strings to a UUIDv5](https://github.com/XTLS/Xray-core/issues/158).

You can use the command `xray uuid -i "custom string"` to generate the UUID mapped from the custom string. You can also use the command `xray uuid` to generate a random UUID.

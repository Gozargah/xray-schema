`KcpObject` corresponds to the `kcpSettings` item in [StreamSettingsObject](https://xtls.github.io/en/config/transport.html#streamsettingsobject).

### TIP

The `header` and `seed` fields have been removed. Please use [FinalMask](https://xtls.github.io/en/config/transports/finalmask.html#finalmaskobject) for configuration. Additionally, the previously default mKCP obfuscation has also been removed. To connect to a legacy server, you need to configure `mkcp-original` in FinalMask.

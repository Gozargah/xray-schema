Controls the version on which this config can run. This prevents accidental running on unexpected client versions when sharing the config. The client will check if the current version matches this requirement at runtime.

Both `min` and `max` are optional. Not setting them or leaving them empty means no restrictions. It does not need to be an actual existing version, as long as it complies with the Xray version syntax x.y.z.

**25.8.3** is the version where Xray added this feature. Setting a version lower than this is meaningless (older versions will not check it).

[Documentation ↗](https://xtls.github.io/en/config/version.html)

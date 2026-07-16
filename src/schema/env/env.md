Environment variables are used to adjust some underlying Xray settings.

Environment variables can either be written to the current Xray process by the configuration file's `env` item after the configuration is read, or supplied through a shell or service manager before Xray starts.

> `environment variable name`: string

Both the environment variable name and its value must be strings. After Xray reads and merges all configuration files, it writes the entries in `env` to the current process environment before building its modules.

### TIP

When [multiple configuration files](https://xtls.github.io/en/config/features/multiple.html) are used, their `env` items are merged by key. A duplicate key from a later file overrides the earlier value.

The `env` item sets the exact name written in the configuration and replaces an existing process variable with that exact name.

### WARNING

The `env` item takes effect only after the configuration files have been located, read, and merged. Some environment variables must be set through a shell or service manager before Xray starts, for example:

- `XRAY_JSON_STRICT`
- `XRAY_LOCATION_CONFIG`
- `XRAY_LOCATION_CONFDIR`
- `GOGC`
- `GOMEMLIMIT`
- `GOMAXPROCS`
- `GOTRACEBACK`

[Documentation ↗](https://xtls.github.io/en/config/env.html)

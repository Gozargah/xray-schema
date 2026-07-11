Environment variables are used to adjust some underlying Xray settings.

They can be set either through the `env` item in the configuration file or in the traditional way as process environment variables before Xray starts.

### TIP

Built-in Xray variables accept both lowercase, dot-separated names and uppercase, underscore-separated names, such as `xray.location.asset` and `XRAY_LOCATION_ASSET`. If both forms exist, the dot-separated form takes precedence.
This page uses the dot-separated form throughout; the uppercase, underscore-separated form is recommended when setting variables through a shell or service manager for better compatibility.

## EnvObject

`EnvObject` corresponds to the `env` item in the configuration file. It is a mapping of environment variable names to values.

> `environment variable name`: string

Both the environment variable name and its value must be strings. After Xray reads and merges all configuration files, it writes the entries in `env` to the current process environment before building its modules.

### TIP

When multiple configuration files are used, their `env` items are merged by key. A duplicate key from a later file overrides the earlier value.

The `env` item sets the exact name written in the configuration and replaces an existing process variable with that exact name.

### WARNING

The `env` item takes effect only after the configuration files have been located, read, and merged. For the following three options to affect the current startup, they must therefore be supplied as process environment variables before Xray starts. Placing them in the configuration file's `env` item cannot affect how that configuration is located or parsed:

- `xray.json.strict`
- `xray.location.config`
- `xray.location.confdir`

## Setting Process Environment Variables

The following examples set both the resource file path and the strict JSON parser:

```bash
# Set the variables in the current shell and its child processes
export XRAY_LOCATION_ASSET=/usr/local/share/xray
export XRAY_JSON_STRICT=true

# Alternatively, set them for a single Xray invocation, separated by spaces
XRAY_LOCATION_ASSET=/usr/local/share/xray XRAY_JSON_STRICT=true xray run
```

```powershell
# Set the variables in the current PowerShell session and its child processes
$env:XRAY_LOCATION_ASSET = "C:\Xray"
$env:XRAY_JSON_STRICT = "true"
```

```batch
:: Set the variables in the current CMD session and its child processes
set "XRAY_LOCATION_ASSET=C:\Xray"
set "XRAY_JSON_STRICT=true"
```

```ini
# Set the variables in the Xray service's [Service] section
[Service]
Environment="XRAY_LOCATION_ASSET=/usr/local/share/xray"
Environment="XRAY_JSON_STRICT=true"
```

## Built-in Xray Variables

### Resource File Path

- Name: `xray.location.asset`.
- Default value: Specific [FHS](https://en.wikipedia.org/wiki/Filesystem_Hierarchy_Standard) directories or the directory containing the Xray executable.

This variable specifies the directory containing the `geoip.dat` and `geosite.dat` files.
If it is not specified, the program looks for resource files in the following order:

```text
./
/etc/xray/
/usr/share/xray
```

### Configuration File Location

- Name: `xray.location.config`.
- Default value: The directory containing the Xray executable.

This variable specifies the directory containing the `config.json` file.

Setting it in the configuration file's `env` item has no effect because Xray locates the configuration file before reading that item.

### Multiple Configuration Directory

- Name: `xray.location.confdir`.
- Default value: `""`.

The `.json` files in this directory are read in filename order as multiple configuration files.

Setting it in the configuration file's `env` item has no effect because Xray locates the configuration directory before reading that item.

This item has lower priority than the `confdir` startup argument.

### Strict JSON Parser

- Name: `xray.json.strict`.
- Default value: `false`.

By default, Xray uses a custom JSON parser at startup. This parser strips comments and other non-standard characters from the configuration. If your configuration files strictly conform to the JSON standard (RFC 8259), you can enable this option to use the standard JSON parser, which can parse very large configurations faster.

Setting it in the configuration file's `env` item has no effect because Xray must select the JSON parser before it can read that item.

### Other Available Variables

- `xray.location.cert`
- `xray.buf.readv`
- `xray.buf.splice`
- `xray.vmess.padding`
- `xray.cone.disabled`
- `xray.ray.buffer.size`
- `xray.browser.dialer`
- `xray.xudp.show`
- `xray.xudp.basekey`
- `xray.tun.fd`

These options are intended for specialized use cases. Refer to the source code for their exact behavior.

[Documentation ↗](https://xtls.github.io/en/config/env.html)

The level of the error log, indicating the information that needs to be recorded. The default value is `"warning"`.

- `"debug"`: Output information used for debugging. Includes all "info" content.
- `"info"`: Runtime status information, etc., which does not affect normal usage. Includes all `"warning"` content.
- `"warning"`: Information output when issues occur that do not affect normal operation but may impact user experience. Includes all `"error"` content.
- `"error"`: Xray encountered a problem where it cannot operate normally and requires immediate resolution.
- `"none"`: Do not record any content.

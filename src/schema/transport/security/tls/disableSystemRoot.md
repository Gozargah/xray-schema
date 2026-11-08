Whether to disable the default CA certificates. The default value is `false`.

When set to `true`, Xray uses only the certificates specified in `certificates` during TLS handshake. When set to `false`, the default CA list is determined by `useSystemCA`.

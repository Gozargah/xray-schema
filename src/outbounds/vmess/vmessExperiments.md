Enabled VMess protocol experimental features. (Features here are unstable and may be removed at any time). Multiple enabled experiments can be separated by the `|` character, such as `"AuthenticatedLength|NoTerminationSignal"`.

- `"AuthenticatedLength"`: Enable authenticated packet length experiment. This experiment requires both the client and server to enable it simultaneously and run the same version of the program.
- `"NoTerminationSignal"`: Enable not sending the disconnection signal. This feature is now enabled by default.

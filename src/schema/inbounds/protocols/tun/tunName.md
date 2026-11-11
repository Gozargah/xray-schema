The name of the created TUN interface. Default is `"utunN"`.

Where N is a random number between 10 and 1024.

On macOS, the name has to be `utunN`, and on FreeBSD `tunN`. On Windows, an existing Wintun adapter with that name is reused.

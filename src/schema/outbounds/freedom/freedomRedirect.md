Freedom rewrites the connection's current destination address and port to those specified in `redirect`.

The value is a string, e.g., `"127.0.0.1:80"`, `":1234"`.

When the address is not specified, e.g., `":443"`, Freedom will not modify the original destination address. When the port is `0`, e.g., `"xray.com:0"`, Freedom will not modify the original port.

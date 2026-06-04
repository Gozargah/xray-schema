Port. Accepted formats are as follows:

- Integer value: The actual port number.
- Environment variable: Starts with `"env:"`, followed by the name of an environment variable, such as `"env:PORT"`. Xray will parse this environment variable as a string.
- String: Can be a numeric string, such as `"1234"`; or a numerical range, such as `"5-10"` indicating ports 5 to 10 (6 ports in total). Commas can be used for segmentation, such as `11,13,15-17` indicating port 11, port 13, and ports 15 to 17 (5 ports in total).

When only one port is specified, Xray will listen for inbound connections on this port. When a port range is specified, Xray will listen on all ports within the range.

Note that listening on a port is a relatively expensive operation. Listening on a port range that is too large may cause a significant increase in resource usage or even cause Xray to fail to work properly. Generally speaking, problems may begin to appear when the number of listening ports approaches four digits. If you need to use a very large range, please consider using iptables for redirection instead of setting it here.

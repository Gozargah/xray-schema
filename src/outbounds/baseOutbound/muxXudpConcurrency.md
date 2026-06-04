Use a new XUDP aggregation tunnel (i.e., another Mux connection) to proxy UDP traffic. Fill in the maximum number of concurrent sub-UoT. Minimum `1`, maximum `1024`. If omitted or set to `0`, it will follow the same path as TCP traffic, which is the traditional behavior.

### TIP

When set to a negative number, such as `-1`, the Mux module is not used to carry UDP traffic. The proxy protocol's original UDP transmission method will be used. For example, `Shadowsocks` will use native UDP, and `VLESS` will use UoT.

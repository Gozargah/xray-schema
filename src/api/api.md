The API interface configuration provides [gRPC](https://grpc.io/)-based API interfaces for remote procedure calls.

You can enable the interface through the `api` configuration module. When the `api` configuration is enabled, Xray will automatically build an outbound proxy with the same name as the `tag`. You must manually route all API inbound connections to this outbound proxy via [Routing Configuration](https://xtls.github.io/en/config/routing.html). Please refer to [Relevant Configuration](https://xtls.github.io/en/config/api.html#relevant-configuration) in this section.

Since [v1.8.12](https://github.com/XTLS/Xray-core/releases/tag/v1.8.12), a simplified configuration mode is supported. You only need to configure the ApiObject, without needing to configure `inbounds` and `routing`. However, when using the simplified configuration, the traffic statistics feature does not count the traffic of API inbound connections.

[Documentation ↗](https://xtls.github.io/en/config/api.html)

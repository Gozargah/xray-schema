Maximum concurrent connections. Minimum `1`, maximum `128`. If omitted or set to `0`, it equals `8`. Values greater than `128` are treated as 128, because once a connection reaches the maximum reuse count of 128, it will no longer be assigned any new sub-connections.

This value represents the maximum number of sub-connections carried on a single TCP connection. For example, if `concurrency=8` is set, when the client issues 8 TCP requests, Xray will only issue one actual TCP connection, and all 8 requests from the client are transmitted over this TCP connection.

When the maximum sub-connection capacity of all Mux connections is fully occupied, the core will initiate new connections to carry sub-connections. If a large number of sub-connections are concurrent in a short time and subsequently decrease, the internal scheduler of the core will tend to distribute requests to 2 connections alternately and leave other connections idle, waiting for all their sub-connections to end naturally before closing them to save resources. If the total number of sub-connections continues to be lower than `concurrency` for a long time, after one of the connections reaches the maximum reuse count, the core will revert to a single connection state.

### TIP

When set to a negative number, such as `-1`, the Mux module is not used to carry TCP traffic.

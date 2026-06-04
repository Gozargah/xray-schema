The routing module can send inbound data through different outbound connections based on different rules, achieving the purpose of on-demand proxying.

A common usage is splitting traffic between domestic and foreign destinations. Xray can determine the region of the traffic through internal mechanisms and then send them to different outbound proxies.

For a more detailed analysis of the routing function: [Analysis of Routing (Part 1)](https://xtls.github.io/en/document/level-1/routing-lv1-part1.html).

[Documentation ↗](https://xtls.github.io/en/config/routing.html)

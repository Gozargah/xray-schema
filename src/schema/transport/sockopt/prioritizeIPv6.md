Controls which IP family comes first after sorting. The default is `false`, meaning IPv4 comes first.

Unlike the rigid `domainStrategy` in other places, if a route for the request does not exist—such as trying IPv6 first in an IPv4-only environment—the attempt fails immediately and starts trying the next IP without causing redundant delays or connection failures. You can confidently copy this option across different machines as needed.

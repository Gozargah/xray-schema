Default value `"AsIs"`.

The meanings of all parameters are roughly equivalent to `domainStrategy` in [Sockopt](https://xtls.github.io/en/config/transports/sockopt.html#sockoptobject).

Only using `"AsIs"` here allows passing the domain name to the subsequent `sockopt` module. If set to non-`"AsIs"` here, causing the domain to be resolved to a specific IP, it will invalidate the subsequent `sockopt.domainStrategy` and its related `happyEyeballs`. (There is no negative impact if these two settings are not adjusted).

When sending UDP, Freedom ignores `domainStrategy` in `sockopt` for some reasons and forcibly prefers IPv4 by default.

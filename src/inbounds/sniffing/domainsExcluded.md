A list of domains. If the result of traffic sniffing is in this list, the destination address will **not** be reset. The domain format is the same as in [Routing Configuration](https://xtls.github.io/en/config/routing.html#ruleobject).

### TIP

Filling in some domains may solve issues with iOS push notifications, Mijia smart devices, and voice chat in certain games (Rainbow Six).  
If you need to troubleshoot the cause of certain problems, you can test by disabling `"sniffing"` or enabling `"routeOnly"`.

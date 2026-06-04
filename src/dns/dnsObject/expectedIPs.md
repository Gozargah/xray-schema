A list of IP ranges. The format is the same as in [Routing Configuration](https://xtls.github.io/en/config/routing.html#ruleobject).

When configured, Xray DNS will verify the returned IP and only return addresses included in the `expectedIPs` list.

If `*` exists in the list, and if no IP exists after filtering, the original IP is still returned so that the request does not fail.

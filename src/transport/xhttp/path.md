The path used by XHTTP. In most cases, only `path` needs to be set.

For stream-one, a trailing `/` is required and will be added automatically if missing.

In packet-up and stream-up, the UUID and sequence are encoded in the path (not in the query string) to avoid compatibility issues.

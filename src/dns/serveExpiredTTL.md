Validity period for optimistic caching in seconds. Defaults to 0, meaning it never expires.

If the server has caching enabled and optimistic caching is turned on: when the cache has expired but the optimistic cache has not, the stale DNS record in the cache is returned immediately, and the cache is refreshed in the background. This can reduce latency.

Selects the most stable outbound proxy based on observation results.

This strategy must be used with an observatory, and nodes not covered by the observatory will be directly excluded. If all are unavailable and `fallbackTag` is not set, the default outbound will be selected.

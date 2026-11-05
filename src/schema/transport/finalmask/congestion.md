Congestion-control algorithm. Hysteria defaults to `brutal`, while XHTTP H3 and MASQUE default to `bbr`; for MASQUE, `brutal` also runs as `bbr`.

`reno` and `bbr` are well-known algorithms.

`brutal`: negotiates a fixed packet-sending rate with the peer, or falls back to BBR.

`force-brutal`: same as `brutal`, but it forces upstream traffic to use the fixed packet-sending rate from `brutalUp`, ignoring peer negotiation.

Note that XHTTP H3 cannot use `brutal` because it has no negotiation mechanism, but it does support `force-brutal`, which does not require negotiation.

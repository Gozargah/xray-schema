Optional minimum Xray client version in `x.y.z` format.

The default value is `26.3.27`. Lowering this value allows older clients to connect, but their TLS fingerprints differ noticeably from those of real browsers and may be classified as non-browser traffic by DPI. Lower this value at your own risk.

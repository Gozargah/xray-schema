XHTTP provides HTTP-based transport with full upstream/downstream separation, header padding, and XMUX multiplexing. It supports multiple modes and is designed to bypass HTTP middleboxes while maintaining high downstream efficiency.

Defaults are tuned for practical use. In most cases, setting `path` is sufficient.

XHTTP defaults to multiplexing and typically yields lower latency than Vision; multithread throughput can be improved by setting XMUX `maxConcurrency` to 1 for speed tests.

For maximum compatibility with HTTP middleboxes or reverse proxies, prefer the `packet-up` mode.

Do not enable mux.cool when using XHTTP; the server only accepts pure XUDP.

If you need to confirm the HTTP version, host, XHTTP mode, or upstream/downstream separation, set the log level to `info`.

XHTTP is currently documented in the upstream discussion: https://github.com/XTLS/Xray-core/discussions/4113

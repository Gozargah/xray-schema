Legacy mKCP packet-header camouflage/obfuscation. The meaning of `value` depends on `header`. Note that the forgery is only a simple packet-header forgery and does not mean the full protocol is implemented.

> When empty: applies AES-128-GCM encryption with `value` as the password. If `value` is empty, it falls back to the default simple XOR obfuscation.

> `dns`: forged as a DNS query. `value` is the specified domain; defaults to `www.baidu.com` when empty.

> `dtls`: forged as DTLS 1.2 application data. `value` has no effect.

> `srtp`: forged as SRTP. `value` has no effect.

> `utp`: forged as uTP (BitTorrent). `value` has no effect.

> `wechat`: forged as a WeChat video call. `value` has no effect.

> `wireguard`: forged as WireGuard. `value` has no effect.

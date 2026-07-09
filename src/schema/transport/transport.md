Transport configuration controls how the current Xray instance communicates with its peer. That peer may be another Xray node, or it may simply be any ordinary public network target.

It covers the part below the proxy protocol itself, including transport methods, transport security, and additional low-level behavior.

These three categories belong to different layers and can usually be combined:

- Transport methods specify how the data stream is carried, such as RAW, WebSocket, gRPC, Hysteria, and others.
- Transport security specifies the protection mechanism used during transport, such as TLS or REALITY.
- Additional configuration supplements low-level network behavior and final traffic obfuscation.

Some transport settings directly affect how a connection is established with the remote side. For settings that require negotiation, both sides usually need compatible configurations. For example, if one side uses WebSocket, the other side must also use WebSocket, otherwise the connection cannot be established.

For direct outbounds such as [Freedom](https://xtls.github.io/en/config/outbounds/freedom.html), the peer is usually any ordinary public network target, such as Amazon's website or WeChat's servers. In that case, transport configuration does not need to negotiate with the other side, and generally cannot do so either. Instead, it is used to control how the local connection is sent. In that scenario, only `sockopt` is available.

### Transport Methods

### Transport Security

### Additional Configuration

## Transport Compatibility Quick Reference

Both inbounds and outbounds can configure transport methods and transport security through `streamSettings`. In actual configurations, the proxy protocol, transport method, and transport security must be compatible with one another.

### Inbound/Outbound Protocols and Transport Methods

This table corresponds to `protocol + streamSettings.network`.

|                                                                       | `raw`     | `xhttp`   | `grpc`    | `websocket` | `httpupgrade` | `mkcp`    | `hysteria` |
| --------------------------------------------------------------------- | --------- | --------- | --------- | ----------- | ------------- | --------- | ---------- |
| `http`                                                                | Supported | Supported | Supported | Supported   | Supported     | Supported | Supported  |
| `socks` <sup><a href="#protocol-transport-note-1">[1]</a></sup>       | Limited   | Limited   | Limited   | Limited     | Limited       | Limited   | Limited    |
| `shadowsocks` <sup><a href="#protocol-transport-note-1">[1]</a></sup> | Limited   | Limited   | Limited   | Limited     | Limited       | Limited   | Limited    |
| `vmess`                                                               | Supported | Supported | Supported | Supported   | Supported     | Supported | Supported  |
| `vless`                                                               | Supported | Supported | Supported | Supported   | Supported     | Supported | Supported  |
| `trojan`                                                              | Supported | Supported | Supported | Supported   | Supported     | Supported | Supported  |
| `hysteria`                                                            | N/A       | N/A       | N/A       | N/A         | N/A           | N/A       | Supported  |
| `wireguard`                                                           | N/A       | N/A       | N/A       | N/A         | N/A           | N/A       | N/A        |

<small id="protocol-transport-note-1">[1] When XUDP is not enabled for Socks or Shadowsocks, UDP traffic uses the protocol's native UDP path and bypasses the configured transport method; TCP traffic is not subject to this limitation. See [XUDP](https://xtls.github.io/en/config/outbound.html#muxobject).</small><br>

### Transport Methods and Transport Security

This table corresponds to `streamSettings.network + streamSettings.security`.

|               | `none`        | `tls`     | `reality`     |
| ------------- | ------------- | --------- | ------------- |
| `raw`         | Supported     | Supported | Supported     |
| `xhttp`       | Supported     | Supported | Supported     |
| `grpc`        | Supported     | Supported | Supported     |
| `websocket`   | Supported     | Supported | Not supported |
| `httpupgrade` | Supported     | Supported | Not supported |
| `mkcp`        | Supported     | Supported | Not supported |
| `hysteria`    | Not supported | Required  | Not supported |

### Inbound/Outbound Protocols and Transport Security

This table corresponds to `protocol + streamSettings.security`.

|               | `none`                                                         | `tls`                                                          | `reality`                                                      | Protocol-layer security                                                                                |
| ------------- | -------------------------------------------------------------- | -------------------------------------------------------------- | -------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `http`        | Supported                                                      | Supported                                                      | Supported                                                      | None                                                                                                   |
| `socks`       | Supported                                                      | Limited <sup><a href="#protocol-security-note-1">[1]</a></sup> | Limited <sup><a href="#protocol-security-note-1">[1]</a></sup> | None                                                                                                   |
| `shadowsocks` | Supported                                                      | Limited <sup><a href="#protocol-security-note-1">[1]</a></sup> | Limited <sup><a href="#protocol-security-note-1">[1]</a></sup> | Payload encryption and integrity <sup><a href="#protocol-security-note-2">[2]</a></sup>                |
| `vmess`       | Supported                                                      | Supported                                                      | Supported                                                      | Handshake authentication and payload encryption <sup><a href="#protocol-security-note-2">[2]</a></sup> |
| `vless`       | Limited <sup><a href="#protocol-security-note-3">[3]</a></sup> | Supported                                                      | Supported                                                      | Optional Encryption <sup><a href="#protocol-security-note-4">[4]</a></sup>                             |
| `trojan`      | Limited <sup><a href="#protocol-security-note-3">[3]</a></sup> | Supported                                                      | Supported                                                      | Authentication only                                                                                    |
| `hysteria`    | Not supported                                                  | Required                                                       | Not supported                                                  | None (relies on TLS)                                                                                   |
| `wireguard`   | N/A                                                            | N/A                                                            | N/A                                                            | Encrypted tunnel <sup><a href="#protocol-security-note-2">[2]</a></sup>                                |

<small id="protocol-security-note-1">[1] When XUDP is not enabled for Socks or Shadowsocks, UDP traffic uses the protocol's native UDP path and bypasses the configured TLS or REALITY; TCP traffic is not subject to this limitation. See [XUDP](https://xtls.github.io/en/config/outbound.html#muxobject).</small><br>
<small id="protocol-security-note-2">[2] Shadowsocks and VMess protect the payload, but lack TLS 1.3-style forward secrecy, and their traffic patterns can still be classified. WireGuard uses sufficiently strong cryptography, but its fixed UDP signature is easy to identify and block. None of the three provides the ordinary HTTPS appearance offered by TLS/REALITY, so they are unsuitable for direct censorship circumvention.</small><br>
<small id="protocol-security-note-3">[3] When `streamSettings.security` is `none`, VLESS (without Encryption enabled) and Trojan can connect only to private network addresses.</small><br>
<small id="protocol-security-note-4">[4] VLESS Encryption is optional and disabled by default (`encryption: "none"`). When enabled, it allows connections to public network addresses even if `streamSettings.security` is `none`. It protects the VLESS payload but does not provide the ordinary HTTPS appearance of TLS/REALITY, so it is unsuitable for direct censorship circumvention.</small>

[Documentation ↗](https://xtls.github.io/en/config/transport.html)

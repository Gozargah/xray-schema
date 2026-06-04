import z from "zod";
import { httpInboundSchema } from "./protocols/http/http.ts";
import { dokodemoDoorInboundSchema } from "./protocols/dokodemo-door/dokodemo-door.ts";
import { socksInboundSchema } from "./protocols/socks/socks.ts";
import { inboundSnippets } from "./snippets/inbound-snippets.ts";
import { shadowsocksInboundSchema } from "./protocols/shadowsocks/shadowsocks.ts";
import { vlessInboundSchema } from "./protocols/vless/vless.ts";
import { vmessInboundSchema } from "./protocols/vmess/vmess.ts";
import { wireguardInboundSchema } from "./protocols/wireguard/wireguard.ts";
import { trojanInboundSchema } from "./protocols/trojan/trojan.ts";
import { tunInboundSchema } from "./protocols/tun/tun.ts";
import { hysteriaInboundSchema } from "./protocols/hysteria/hysteria.ts";

export const inbound = z
  .discriminatedUnion("protocol", [
    dokodemoDoorInboundSchema,
    httpInboundSchema,
    socksInboundSchema,
    shadowsocksInboundSchema,
    vlessInboundSchema,
    vmessInboundSchema,
    wireguardInboundSchema,
    trojanInboundSchema,
    tunInboundSchema,
    hysteriaInboundSchema,
  ])
  .meta({
    ifThenLogic: true,
    discriminatedFields: ["settings"],
    defaultSnippets: inboundSnippets,
  });

export const inboundSchemaBase = inbound;

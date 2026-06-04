import z from "zod";
import { outboundSchemaBase } from "../baseOutbound/baseOutbound";
import { portLikeSchema } from "../../inbounds/baseInbound/baseInbound";
import { ss22Methods, ssMethods } from "../../inbounds/protocols/shadowsocks/shadowsocks";
import shadowsocksDescription from "./shadowsocks.md?raw";
import shadowsocksAddressDescription from "./shadowsocksAddress.md?raw";
import shadowsocksPortDescription from "./shadowsocksPort.md?raw";
import shadowsocksEmailDescription from "./shadowsocksEmail.md?raw";
import shadowsocksPasswordDescription from "./shadowsocksPassword.md?raw";
import shadowsocksMethodDescription from "./shadowsocksMethod.md?raw";
import shadowsocksUotDescription from "./shadowsocksUot.md?raw";
import shadowsocksUoTVersionDescription from "./shadowsocksUoTVersion.md?raw";
import shadowsocksLevelDescription from "./shadowsocksLevel.md?raw";

const shadowsocksServerSettings = z.object({
  address: z.string().meta({
    markdownDescription: shadowsocksAddressDescription,
  }),
  port: portLikeSchema.meta({
    markdownDescription: shadowsocksPortDescription,
  }),
  email: z.string().optional().meta({
    markdownDescription: shadowsocksEmailDescription,
  }),
  password: z.string().default("").meta({
    markdownDescription: shadowsocksPasswordDescription,
  }),
  method: z.union([ss22Methods, ssMethods]).meta({
    markdownDescription: shadowsocksMethodDescription,
  }),
  uot: z.boolean().default(true).optional().meta({
    markdownDescription: shadowsocksUotDescription,
  }),
  UoTVersion: z.literal(1).or(z.literal(2)).default(2).optional().meta({
    markdownDescription: shadowsocksUoTVersionDescription,
  }),
  level: z.int().default(0).optional().meta({
    markdownDescription: shadowsocksLevelDescription,
  }),
});

export const shadowsocks = outboundSchemaBase
  .extend({
    protocol: z.literal("shadowsocks"),
    settings: shadowsocksServerSettings.or(
      z.object({
        servers: z.array(shadowsocksServerSettings),
      }),
    ),
  })
  .meta({
    markdownDescription: shadowsocksDescription,
  });

import z from "zod";
import { blackhole } from "./blackhole/blackhole";
import { freedom } from "./freedom/freedom";
import { dns } from "./dns/dns";
import { hysteria } from "./hysteria/hysteria";
import { loopback } from "./loopback/loopback";
import { shadowsocks } from "./shadowsocks/shadowsocks";
import { socks } from "./socks/socks";
import { trojan } from "./trojan/trojan";
import { vless } from "./vless/vless";
import { vmess } from "./vmess/vmess";
import { wireguard } from "./wireguard/wireguard";

export const outbound = z
  .discriminatedUnion("protocol", [
    blackhole,
    freedom,
    dns,
    hysteria,
    loopback,
    shadowsocks,
    socks,
    trojan,
    vless,
    vmess,
    wireguard,
  ])
  .meta({
    ifThenLogic: true,
    discriminatedFields: ["settings"],
  });

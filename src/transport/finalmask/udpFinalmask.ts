import z from "zod";
import { headerCustomSettingsObject } from "./customSettingsObject.ts";
import { sudoku } from "./sudoku.ts";
import udpFinalmaskDescription from "./udpFinalmask.md?raw";
import udpTypeDescription from "./udpType.md?raw";
import headerCustomUdpDescription from "./headerCustomUdp.md?raw";
import headerDnsDescription from "./headerDns.md?raw";
import mkcpLegacyDescription from "./mkcpLegacy.md?raw";
import noiseDescription from "./noise.md?raw";
import noiseItemsDescription from "./noiseItems.md?raw";
import salamanderDescription from "./salamander.md?raw";
import packetSizeDescription from "./packetSize.md?raw";
import xdnsDescription from "./xdns.md?raw";
import xicmpDescription from "./xicmp.md?raw";
import xicmpDgramDescription from "./xicmpDgram.md?raw";
import xicmpIpsDescription from "./xicmpIps.md?raw";
import realmDescription from "./realm.md?raw";
import realmUrlDescription from "./realmUrl.md?raw";
import realmStunServersDescription from "./realmStunServers.md?raw";
import realmTlsConfigDescription from "./realmTlsConfig.md?raw";
import domainDescription from "./domain.md?raw";
import xdnsDomainsDescription from "./xdnsDomains.md?raw";
import resolversDescription from "./resolvers.md?raw";
import passwordDescription from "./password.md?raw";
import resetDescription from "./reset.md?raw";
import randDescription from "./rand.md?raw";
import randRangeDescription from "./randRange.md?raw";
import typeDescription from "./type.md?raw";
import packetDescription from "./packet.md?raw";
import delayDescription from "./delay.md?raw";

const tcpHeaderCustom = z
  .object({
    type: z.literal("header-custom").meta({
      markdownDescription: udpTypeDescription,
    }),
    settings: z
      .object({
        client: z.array(headerCustomSettingsObject),
        server: z.array(headerCustomSettingsObject),
      })
      .meta({
        markdownDescription: headerCustomUdpDescription,
      }),
  })
  .meta({
    markdownDescription: headerCustomUdpDescription,
  });

const headerDns = z
  .object({
    type: z.literal("header-dns").meta({
      markdownDescription: udpTypeDescription,
    }),
    settings: z
      .object({
        domain: z.string().meta({
          markdownDescription: domainDescription,
        }),
      })
      .meta({
        markdownDescription: headerDnsDescription,
      }),
  })
  .meta({
    markdownDescription: headerDnsDescription,
  });

const mkcpLegacy = z
  .object({
    type: z.literal("mkcp-legacy").meta({
      markdownDescription: udpTypeDescription,
    }),
    settings: z
      .discriminatedUnion("header", [
        z.object({
          header: z.literal("").meta({
            markdownDescription:
              "applies AES-128-GCM encryption with `value` as the password. If `value` is empty, it falls back to the default simple XOR obfuscation.",
          }),
          value: z.string().meta({
            markdownDescription:
              "If value is empty, it falls back to the default simple XOR obfuscation.",
          }),
        }),
        z.object({
          header: z.literal("dns").meta({
            markdownDescription: "Forged as a DNS query.",
          }),
          value: z.string().meta({
            markdownDescription:
              "`value` is the specified domain; defaults to `www.baidu.com` when empty.",
          }),
        }),
        z.object({
          header: z.literal("dtls").meta({
            markdownDescription: "Forged as DTLS 1.2 application data.",
          }),
          value: z.string().meta({
            markdownDescription: "`value` has no effect.",
          }),
        }),
        z.object({
          header: z.literal("srtp").meta({
            markdownDescription: "Forged as SRTP, `value` has no effect.",
          }),
        }),
        z.object({
          header: z.literal("utp").meta({
            markdownDescription: "forged as uTP (BitTorrent), `value` has no effect.",
          }),
        }),
        z.object({
          header: z.literal("wechat").meta({
            markdownDescription: "forged as a WeChat video call., `value` has no effect.",
          }),
        }),
        z.object({
          header: z.literal("wireguard").meta({
            markdownDescription: "forged as WireGuard, `value` has no effect.",
          }),
        }),
      ])
      .meta({
        markdownDescription: mkcpLegacyDescription,
      }),
  })
  .meta({
    markdownDescription: mkcpLegacyDescription,
  });

const noise = z
  .object({
    type: z.literal("noise").meta({
      markdownDescription: udpTypeDescription,
    }),
    settings: z
      .object({
        reset: z.int().meta({
          markdownDescription: resetDescription,
        }),
        noise: z
          .array(
            z
              .object({
                rand: z.string().meta({
                  markdownDescription: randDescription,
                }),
                randRange: z.string().meta({
                  markdownDescription: randRangeDescription,
                }),
                type: z.string().meta({
                  markdownDescription: typeDescription,
                }),
                packet: z.array(z.any()).meta({
                  markdownDescription: packetDescription,
                }),
                delay: z.string().meta({
                  markdownDescription: delayDescription,
                }),
              })
              .meta({
                defaultSnippets: [
                  {
                    label: "noise 1-8192",
                    description: "noise example from the docs",
                    body: {
                      rand: "1-8192",
                      randRange: "0-255",
                      type: "",
                      packet: [],
                      delay: "10-20",
                    },
                  },
                ],
                markdownDescription: noiseItemsDescription,
              }),
          )
          .meta({
            markdownDescription: noiseItemsDescription,
          }),
      })
      .meta({
        markdownDescription: noiseDescription,
      }),
  })
  .meta({
    markdownDescription: noiseDescription,
  });

const salamander = z
  .object({
    type: z.literal("salamander").meta({
      markdownDescription: udpTypeDescription,
    }),
    settings: z
      .object({
        password: z.string().meta({
          markdownDescription: passwordDescription,
        }),
        packetSize: z.string().optional().meta({
          markdownDescription: packetSizeDescription,
        }),
      })
      .meta({
        markdownDescription: salamanderDescription,
      }),
  })
  .meta({
    markdownDescription: salamanderDescription,
  });

const xdns = z
  .object({
    type: z.literal("xdns").meta({
      markdownDescription: udpTypeDescription,
    }),
    settings: z
      .object({
        // server only
        domains: z.array(z.string()).min(1).meta({
          markdownDescription: xdnsDomainsDescription,
        }),
      })
      .or(
        z.object({
          // client only
          resolvers: z.array(z.string()).min(1).meta({
            markdownDescription: resolversDescription,
          }),
        }),
      )
      .meta({
        markdownDescription: xdnsDescription,
      }),
  })
  .meta({
    markdownDescription: xdnsDescription,
  });

const xicmp = z
  .object({
    type: z.literal("xicmp").meta({
      markdownDescription: udpTypeDescription,
    }),
    settings: z
      .object({
        dgram: z.boolean().default(false).optional().meta({
          markdownDescription: xicmpDgramDescription,
        }),
        ips: z.array(z.string()).default([]).optional().meta({
          markdownDescription: xicmpIpsDescription,
        }),
      })
      .meta({
        markdownDescription: xicmpDescription,
      }),
  })
  .meta({
    markdownDescription: xicmpDescription,
  });

const realm = z
  .object({
    type: z.literal("realm").meta({
      markdownDescription: udpTypeDescription,
    }),
    settings: z
      .object({
        url: z.string().min(1).meta({
          markdownDescription: realmUrlDescription,
        }),
        stunServers: z.array(z.string()).min(1).meta({
          markdownDescription: realmStunServersDescription,
        }),
        tlsConfig: z.object({}).loose().meta({
          markdownDescription: realmTlsConfigDescription,
        }),
      })
      .meta({
        markdownDescription: realmDescription,
      }),
  })
  .meta({
    markdownDescription: realmDescription,
  });

export const udpFinalmask = z
  .array(
    z.discriminatedUnion("type", [
      tcpHeaderCustom,
      headerDns,
      mkcpLegacy,
      noise,
      salamander,
      sudoku,
      xdns,
      xicmp,
      realm,
    ]),
  )
  .meta({
    markdownDescription: udpFinalmaskDescription,
  });

import z from "zod";
import { portLikeSchema } from "../../inbounds/baseInbound/baseInbound";
import { outboundSchemaBase } from "../baseOutbound/baseOutbound";
import freedomDescription from "./freedom.md?raw";
import freedomSettingsDescription from "./freedomSettings.md?raw";
import freedomDomainStrategyDescription from "./freedomDomainStrategy.md?raw";
import freedomRedirectDescription from "./freedomRedirect.md?raw";
import freedomUserLevelDescription from "./freedomUserLevel.md?raw";
import freedomFragmentDescription from "./freedomFragment.md?raw";
import freedomNoisesDescription from "./freedomNoises.md?raw";
import freedomProxyProtocolDescription from "./freedomProxyProtocol.md?raw";
import freedomFinalRulesDescription from "./freedomFinalRules.md?raw";
import freedomFinalRuleDescription from "./freedomFinalRule.md?raw";
import freedomFinalRuleActionDescription from "./freedomFinalRuleAction.md?raw";
import freedomFinalRuleNetworkDescription from "./freedomFinalRuleNetwork.md?raw";
import freedomFinalRulePortDescription from "./freedomFinalRulePort.md?raw";
import freedomFinalRuleIpDescription from "./freedomFinalRuleIp.md?raw";
import freedomFinalRuleBlockDelayDescription from "./freedomFinalRuleBlockDelay.md?raw";

const fragment = z
  .object({
    length: z.int().or(z.string()),
    interval: z.int().or(z.string()),
    packets: z.literal("tlshello").or(z.string()),
  })
  .meta({
    markdownDescription: freedomFragmentDescription,
  });

const noise = z.object({
  type: z.enum(["rand", "str", "base64"]),
  packet: z.string(),
  delay: z.int().or(z.string()).optional(),
});

const finalRule = z
  .object({
    action: z.enum(["allow", "block"]).meta({
      markdownDescription: freedomFinalRuleActionDescription,
    }),
    network: z.enum(["tcp", "udp", "tcp,udp"]).meta({
      markdownDescription: freedomFinalRuleNetworkDescription,
    }),
    port: portLikeSchema.meta({
      markdownDescription: freedomFinalRulePortDescription,
    }),
    ip: z.array(z.string()).optional().meta({
      markdownDescription: freedomFinalRuleIpDescription,
    }),
    blockDelay: z.string().optional().meta({
      markdownDescription: freedomFinalRuleBlockDelayDescription,
    }),
  })
  .meta({
    markdownDescription: freedomFinalRuleDescription,
  });

export const freedom = outboundSchemaBase
  .extend({
    protocol: z.literal("freedom").or(z.literal("direct")),
    settings: z
      .object({
        domainStrategy: z
          .enum([
            "AsIs",
            "UseIP",
            "UseIPv6v4",
            "UseIPv6",
            "UseIPv4v6",
            "UseIPv4",
            "ForceIP",
            "ForceIPv6v4",
            "ForceIPv6",
            "ForceIPv4v6",
            "ForceIPv4",
          ])
          .default("AsIs")
          .optional()
          .meta({
            markdownDescription: freedomDomainStrategyDescription,
          }),
        redirect: z.string().optional().meta({
          markdownDescription: freedomRedirectDescription,
        }),
        userLevel: z.int().default(0).optional().meta({
          markdownDescription: freedomUserLevelDescription,
        }),
        fragment: fragment.optional(),
        noises: z.array(noise).optional().meta({
          markdownDescription: freedomNoisesDescription,
        }),
        proxyProtocol: z.literal(0).or(z.literal(1)).or(z.literal(2)).default(0).optional().meta({
          markdownDescription: freedomProxyProtocolDescription,
        }),
        finalRules: z.array(finalRule).default([]).optional().meta({
          markdownDescription: freedomFinalRulesDescription,
        }),
      })
      .optional()
      .meta({
        markdownDescription: freedomSettingsDescription,
      }),
  })
  .meta({
    markdownDescription: freedomDescription,
  });

import z from "zod";
import { outboundSchemaBase } from "../baseOutbound/baseOutbound";
import dnsDescription from "./dns.md?raw";
import dnsSettingsDescription from "./dnsSettings.md?raw";
import dnsRewriteNetworkDescription from "./dnsRewriteNetwork.md?raw";
import dnsRewriteAddressDescription from "./dnsRewriteAddress.md?raw";
import dnsRewritePortDescription from "./dnsRewritePort.md?raw";
import dnsUserLevelDescription from "./dnsUserLevel.md?raw";
import dnsRulesDescription from "./dnsRules.md?raw";
import dnsRuleDescription from "./dnsRule.md?raw";
import dnsRuleActionDescription from "./dnsRuleAction.md?raw";
import dnsRuleQtypeDescription from "./dnsRuleQtype.md?raw";
import rCodeDescription from "./rCode.md?raw";
import dnsRuleDomainDescription from "./dnsRuleDomain.md?raw";

const dnsRule = z
  .object({
    action: z.enum(["direct", "hijack", "drop", "return"]).meta({
      markdownDescription: dnsRuleActionDescription,
    }),
    qtype: z.number().or(z.string()).optional().meta({
      markdownDescription: dnsRuleQtypeDescription,
    }),
    rCode: z.number().optional().meta({
      markdownDescription: rCodeDescription,
    }),
    domain: z.array(z.string()).meta({
      markdownDescription: dnsRuleDomainDescription,
    }),
  })
  .meta({
    markdownDescription: dnsRuleDescription,
  });

export const dns = outboundSchemaBase
  .extend({
    protocol: z.literal("dns"),
    settings: z
      .object({
        rewriteNetwork: z.enum(["tcp", "udp"]).optional().meta({
          markdownDescription: dnsRewriteNetworkDescription,
        }),
        rewriteAddress: z.string().optional().meta({
          markdownDescription: dnsRewriteAddressDescription,
        }),
        rewritePort: z.string().optional().meta({
          markdownDescription: dnsRewritePortDescription,
        }),
        userLevel: z.int().default(0).optional().meta({
          markdownDescription: dnsUserLevelDescription,
        }),
        rules: z.array(dnsRule).default([]).optional().meta({
          markdownDescription: dnsRulesDescription,
        }),
      })
      .meta({
        markdownDescription: dnsSettingsDescription,
      }),
  })
  .meta({
    markdownDescription: dnsDescription,
  });

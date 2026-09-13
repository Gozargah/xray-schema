import z from "zod";
import routingDescription from "./routing.md?raw";
import domainStrategyDescription from "./domainStrategy.md?raw";
import rulesDescription from "./rules.md?raw";
import balancersDescription from "./balancers.md?raw";
import { routingRule } from "./ruleObject/ruleObject.ts";
import { balancerObject } from "./balancerObject/balancerObject.ts";

export const routingSchema = z
  .object({
    domainStrategy: z
      .union([
        z.literal("AsIs").meta({
          markdownDescription: "Does not perform DNS resolution. Default value.",
        }),
        z.literal("IPIfNonMatch").meta({
          markdownDescription:
            "Domain names are not resolved initially. If no rule matches after the full pass and the target includes a domain name, Xray starts a second pass. During that pass, when it encounters a rule containing an `ip` condition, it uses the built-in DNS server to resolve the domain name to IPs for matching.",
        }),
        z.literal("IPOnDemand").meta({
          markdownDescription:
            "If the target includes a domain name, Xray uses the built-in DNS server to resolve it to IPs for matching when it encounters a rule containing an `ip` condition. If resolution fails, the original destination IP is used for matching.",
        }),
      ])
      .optional()
      .meta({
        markdownDescription: domainStrategyDescription,
      }),
    rules: z.array(routingRule).optional().meta({
      markdownDescription: rulesDescription,
    }),
    balancers: z.array(balancerObject).optional().meta({
      markdownDescription: balancersDescription,
    }),
  })
  .loose()
  .meta({
    markdownDescription: routingDescription,
  });

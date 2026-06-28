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
          markdownDescription:
            "No extra operation. Uses the domain in the destination address or the sniffed domain. Default value.",
        }),
        z.literal("IPIfNonMatch").meta({
          markdownDescription:
            "When no rule is matched after a full round of matching, resolve the domain to an IP and perform a second round of matching.",
        }),
        z.literal("IPOnDemand").meta({
          markdownDescription:
            "Before starting matching, resolve the domain to an IP immediately for matching.",
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

import z from "zod";

const costsObject = z.object({
  regexp: z.boolean().default(false).optional().meta({
    markdownDescription: `Whether to use regular expressions to select outbound \`Tag\`.`,
  }),
  match: z.string().optional().meta({ markdownDescription: `Matches outbound \`Tag\`.` }),
  value: z.float32().optional().meta({
    markdownDescription: `Weight value. The larger the value, the less likely the corresponding node is to be selected.`,
  }),
});

export const leastLoadSettingsObject = z
  .object({
    expected: z.number().optional().meta({
      markdownDescription: `The number of optimal nodes selected by the load balancer. Traffic will be randomly distributed among these nodes.`,
    }),
    maxRTT: z
      .string()
      .optional()
      .meta({ markdownDescription: `The maximum acceptable RTT duration for speed tests.` }),
    tolerance: z.float32().optional().meta({
      markdownDescription: `The maximum acceptable failure rate for speed tests. For example, 0.01 means accepting a 1% failure rate. (Seemingly unimplemented).`,
    }),
    baselines: z.array(z.string()).optional().meta({
      markdownDescription: `The maximum acceptable standard deviation duration for RTT speed tests.`,
    }),
    costs: z.array(costsObject).default([]).optional().meta({
      markdownDescription: `Optional configuration item. An array to assign weights to all outbounds.`,
    }),
  })
  .meta({
    markdownDescription: `The configuration format varies for different load balancing strategies. Currently, only the leastLoad strategy supports this item.`,
  });

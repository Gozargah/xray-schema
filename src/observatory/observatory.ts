import z from "zod";

export const observatory = z
  .object({
    subjectSelector: z.array(z.string()).meta({
      markdownDescription: `An array of strings, where each string is used for prefix matching against outbound proxy tags. Given the following outbound proxy tags: \`[ "a", "ab", "c", "ba" ]\`, \`"subjectSelector": ["a"]\` will match \`[ "a", "ab" ]\`.`,
    }),
    probeUrl: z.string().default("https://www.google.com/generate_204").meta({
      markdownDescription: `The URL used to probe the connection status of the outbound proxy.`,
    }),
    probeInterval: z.string().meta({
      markdownDescription: `The interval for initiating probes. The time format is number + unit, such as \`"10s"\`, \`"2h45m"\`. Supported time units are \`ns\`, \`us\`, \`ms\`, \`s\`, \`m\`, \`h\`, corresponding to nanoseconds, microseconds, milliseconds, seconds, minutes, and hours respectively.

Note that since the request interval is fixed, periodic fixed requests might lead to behavioral fingerprinting. Using protocols with multiplexing or enabling \`mux\` can alleviate this issue.`,
    }),
    enableConcurrency: z
      .boolean()
      .default(false)
      .optional()
      .meta({
        markdownDescription: `- \`true\`: Probe all matched outbound proxies concurrently. Pauses for the time set in \`probeInterval\` after all are completed.
- \`false\`: Probe matched outbound proxies one by one. Pauses for the time set in \`probeInterval\` after each outbound proxy is probed.
`,
      }),
  })
  .meta({
    markdownDescription: `The Observatory component uses HTTPing to probe the connection status of outbound proxies. The observation results can be used by other components, such as the Load Balancer. Currently, there are two types: [observatory](https://xtls.github.io/en/config/observatory.html#observatoryobject) (Background Connection Observatory) and [burstObservatory](https://xtls.github.io/en/config/observatory.html#burstobservatoryobject) (Burst Connection Observatory). Choose one according to your needs.`,
  });

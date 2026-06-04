import z from "zod";

const durationSchema = z.templateLiteral([
  z.number().int().nonnegative().min(1),
  z.literal(["ns", "us", "ms", "s", "m", "h"]),
]);

const burstObservatoryPingConfig = z.object({
  destination: z
    .string()
    .default("https://connectivitycheck.gstatic.com/generate_204")
    .optional()
    .meta({
      markdownDescription: `The URL used to probe the connection status of the outbound proxy. This URL should return an HTTP 204 success status code.`,
    }),
  connectivity: z
    .string()
    .default("")
    .optional()
    .meta({
      markdownDescription: `The URL used to check local network connectivity. This URL should return an HTTP 204 success status code.

An empty string indicates no local network connectivity check.

This probe is executed only when the \`destination\` probe fails. This makes the cause of network failure clearer in the logs.

Note: In transparent proxy mode, this request might be captured by the transparent proxy and re-enter Xray for routing (depending on your configuration). You need to use extra means to ensure it is not captured by the transparent proxy, such as bypassing based on the URL IP, or using cgroup/pid routing to completely prevent Xray's requests from being captured. Alternatively, you can choose a URL that matches a direct connection rule and allow this request to be captured by the transparent proxy.
`,
    }),
  interval: durationSchema
    .default("1m")
    .optional()
    .meta({
      markdownDescription: `The expected **average** probe interval for each outbound proxy.

The time format is number + unit, such as \`"10s"\`, \`"2h45m"\`. Supported time units are \`ns\`, \`us\`, \`ms\`, \`s\`, \`m\`, \`h\`, corresponding to nanoseconds, microseconds, milliseconds, seconds, minutes, and hours respectively.
Minimum allowed value is \`"10s"\`. If less is specified, \`"10s"\` will be used.
`,
    }),
  sampling: z.number().int().nonnegative().default(10).optional().meta({
    markdownDescription: `The number of recent probe results to keep`,
  }),
  timeout: durationSchema
    .default("5s")
    .optional()
    .meta({
      markdownDescription: `Probe timeout. Format is the same as interval above.
The time format is number + unit, such as \`"10s"\`, \`"2h45m"\`. Supported time units are \`ns\`, \`us\`, \`ms\`, \`s\`, \`m\`, \`h\`, corresponding to nanoseconds, microseconds, milliseconds, seconds, minutes, and hours respectively.`,
    }),
  httpMethod: z
    .enum(["GET", "POST", "HEAD", "DELETE", "PATCH", "PUT"])
    .default("HEAD")
    .optional()
    .meta({
      markdownDescription: `The HTTP method used for probing (e.g. \`"HEAD"\`, \`"GET"\`)`,
    }),
});

export const burstObservatory = z
  .object({
    subjectSelector: z.array(z.string()).meta({
      markdownDescription: `An array of strings, where each string is used for prefix matching against outbound proxy tags. Given the following outbound proxy tags: \`[ "a", "ab", "c", "ba" ]\`, \`"subjectSelector": ["a"]\` will match \`[ "a", "ab" ]\`.`,
    }),
    pingConfig: burstObservatoryPingConfig.optional(),
  })
  .meta({
    markdownDescription: `The Observatory component uses HTTPing to probe the connection status of outbound proxies. The observation results can be used by other components, such as the Load Balancer. Currently, there are two types: [observatory](https://xtls.github.io/en/config/observatory.html#observatoryobject) (Background Connection Observatory) and [burstObservatory](https://xtls.github.io/en/config/observatory.html#burstobservatoryobject) (Burst Connection Observatory). Choose one according to your needs.`,
  });

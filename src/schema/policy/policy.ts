import z from "zod";
import bufferSizeDescription from "./bufferSize.md?raw";

export const policySchema = z
  .object({
    levels: z
      .record(
        z.string(),
        z.object({
          handshake: z.number().default(4).optional().meta({
            markdownDescription: `Handshake time limit when establishing a connection. Unit is seconds. Default value is \`4\`. When an inbound proxy processes a new connection, if the time used during the handshake phase exceeds this time, the connection is interrupted.`,
          }),
          connIdle: z.number().default(300).optional().meta({
            markdownDescription: `Connection idle time limit. Unit is seconds. Default value is \`300\`. When an inbound/outbound processes a connection, if no data is transferred (including uplink and downlink data) within the \`connIdle\` time, the connection is interrupted.`,
          }),
          uplinkOnly: z.number().default(2).optional().meta({
            markdownDescription: `Time limit after the downlink connection is closed. Unit is seconds. Default value is \`2\`. When the server (such as a remote website) closes the downlink connection, the outbound proxy will interrupt the connection after waiting for the \`uplinkOnly\` time.`,
          }),
          downlinkOnly: z
            .number()
            .default(5)
            .optional()
            .meta({
              markdownDescription: `Time limit after the uplink connection is closed. Unit is seconds. Default value is \`5\`. When the client (such as a browser) closes the uplink connection, the inbound proxy will interrupt the connection after waiting for the \`downlinkOnly\` time.
---
In HTTP browsing scenarios, \`uplinkOnly\` and \`downlinkOnly\` can be set to 0 to improve connection closing efficiency.`,
            }),
          statsUserUplink: z.boolean().default(false).optional().meta({
            markdownDescription: `When set to \`true\`, enables uplink traffic statistics for all users of the current level.`,
          }),
          statsUserDownlink: z.boolean().default(false).optional().meta({
            markdownDescription: `When set to \`true\`, enables downlink traffic statistics for all users of the current level.`,
          }),
          statsUserOnline: z.boolean().default(false).optional().meta({
            markdownDescription: `When set to \`true\`, enables online user count statistics for all users of the current level. (Online criteria: connection activity within 20 seconds).`,
          }),
          bufferSize: z.number().optional().meta({
            markdownDescription: bufferSizeDescription,
          }),
        }),
      )
      .optional()
      .meta({
        markdownDescription: `A set of key-value pairs, where each key is a number in string format (required by JSON), such as \`"0"\`, \`"1"\`, etc. The double quotes cannot be omitted. This number corresponds to the user level. Each value is a [LevelPolicyObject](https://xtls.github.io/en/config/policy.html#levelpolicyobject).`,
      }),
    system: z
      .object({
        statsInboundUplink: z.boolean().default(false).optional().meta({
          markdownDescription: `When set to \`true\`, enables uplink traffic statistics for all inbound proxies.`,
        }),
        statsInboundDownlink: z.boolean().default(false).optional().meta({
          markdownDescription: `When set to \`true\`, enables downlink traffic statistics for all inbound proxies.`,
        }),
        statsOutboundUplink: z.boolean().default(false).optional().meta({
          markdownDescription: `When set to \`true\`, enables uplink traffic statistics for all outbound proxies.`,
        }),
        statsOutboundDownlink: z.boolean().default(false).optional().meta({
          markdownDescription: `When set to \`true\`, enables downlink traffic statistics for all outbound proxies.`,
        }),
      })
      .optional()
      .meta({
        markdownDescription: `Xray system-level policies.`,
      }),
  })
  .meta({
    markdownDescription: `Local policy allows setting different user levels and corresponding policy settings, such as connection timeout settings. Every connection processed by Xray corresponds to a user, and different policies are applied according to the user's level.


[Documentation ↗](https://xtls.github.io/en/config/policy.html)`,
  });

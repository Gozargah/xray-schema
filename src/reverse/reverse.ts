import z from "zod";
import reverseDescription from "./reverse.md?raw";

const bridgeObject = z
  .object({
    tag: z.string().optional().meta({
      markdownDescription: `All connections initiated by the \`bridge\` will carry this tag. It can be identified using \`inboundTag\` in the [Routing Configuration](https://xtls.github.io/en/config/routing.html).`,
    }),
    domain: z
      .string()
      .optional()
      .meta({
        markdownDescription: `Specifies a domain name. Connections established by the \`bridge\` to the \`portal\` will be sent using this domain.
This domain is used solely for communication between the \`bridge\` and the \`portal\` and does not need to exist in reality.`,
      }),
  })
  .meta({
    markdownDescription: `An array, where each item represents a \`bridge\`. The configuration for each \`bridge\` is a [BridgeObject](https://xtls.github.io/en/config/reverse.html#bridgeobject).`,
  });

const portalObject = z
  .object({
    tag: z.string().optional().meta({
      markdownDescription: `The identifier for the \`portal\`. Use \`outboundTag\` in the [Routing Configuration](https://xtls.github.io/en/config/routing.html) to forward traffic to this \`portal\`.`,
    }),
    domain: z
      .string()
      .optional()
      .meta({
        markdownDescription: `A domain name. When the \`portal\` receives traffic, if the target domain of the traffic matches this domain, the \`portal\` considers the current connection to be a communication connection sent by the \`bridge\`. Other traffic will be treated as traffic that needs to be forwarded. The job of the \`portal\` is to identify these two types of connections and perform the corresponding forwarding.

A single Xray instance can act as a \`bridge\`, a \`portal\`, or both simultaneously to suit different scenario requirements.`,
      }),
  })
  .meta({
    markdownDescription: `An array, where each item represents a \`portal\`. The configuration for each \`portal\` is a [PortalObject](https://xtls.github.io/en/config/reverse.html#bridgeobject).`,
  });

export const reverse = z
  .object({
    bridges: z.array(bridgeObject).optional(),
    portals: z.array(portalObject).min(1),
  })
  .or(
    z.object({
      bridges: z.array(bridgeObject).min(1),
      portals: z.array(portalObject).optional(),
    }),
  )
  .meta({
    markdownDescription: reverseDescription,
    deprecated: true,
    deprecationMessage: `This feature has been deprecated. Please use the VLESS reverse proxy.`,
  });

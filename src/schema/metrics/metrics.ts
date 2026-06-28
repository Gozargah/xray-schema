import z from "zod";

const listenDescription = `Directly listen on an address and port to provide the service.
---
[Usage ↗](https://xtls.github.io/en/config/metrics.html#usage)`;

const tagDescription = `The outbound proxy tag corresponding to metrics. You can access it by setting up a dokodemo-door inbound + routing rules that point the dokodemo-door to this outbound.`;

export const metrics = z
  .object({
    tag: z.string().meta({ markdownDescription: tagDescription }),
    listen: z.string().optional().meta({ markdownDescription: listenDescription }),
  })
  .or(
    z.object({
      tag: z.string().optional().meta({ markdownDescription: tagDescription }),
      listen: z.string().meta({ markdownDescription: listenDescription }),
    }),
  )
  .meta({
    markdownDescription: `A more direct (and hopefully better) way to export statistics.


[Documentation ↗](https://xtls.github.io/en/config/metrics.html)`,
  });

import z from "zod";
import { headerCustomSettingsObject } from "./customSettingsObject.ts";
import { sudoku } from "./sudoku.ts";
import tcpFinalmaskDescription from "./tcpFinalmask.md?raw";
import tcpTypeDescription from "./tcpType.md?raw";
import headerCustomTcpDescription from "./headerCustomTcp.md?raw";
import fragmentDescription from "./fragment.md?raw";
import packetsDescription from "./packets.md?raw";
import lengthsDescription from "./lengths.md?raw";
import delaysDescription from "./delays.md?raw";
import maxSplitDescription from "./maxSplit.md?raw";
import delayDescription from "./delay.md?raw";

const tcpHeaderCustom = z
  .object({
    type: z.literal("header-custom").meta({
      markdownDescription: tcpTypeDescription,
    }),
    settings: z
      .object({
        clients: z.array(z.array(headerCustomSettingsObject)),
        servers: z.array(z.array(headerCustomSettingsObject)),
        errors: z.array(z.array(headerCustomSettingsObject)),
      })
      .meta({
        markdownDescription: headerCustomTcpDescription,
      }),
  })
  .meta({
    markdownDescription: headerCustomTcpDescription,
  });

const tcpFragment = z
  .object({
    type: z.literal("fragment").meta({
      markdownDescription: tcpTypeDescription,
    }),
    settings: z
      .object({
        packets: z
          .string()
          .or(z.enum(["1-3", "tlshello"]))
          .meta({
            markdownDescription: packetsDescription,
          }),
        length: z.string().or(z.number()).meta({
          deprecated: true,
          deprecationMessage: "use `lengths` option instead",
          markdownDescription: `Packet length or range used by the TCP fragment layer.`,
        }),
        lengths: z.array(z.string()).meta({
          markdownDescription: lengthsDescription,
        }),
        delay: z.string().or(z.number()).meta({
          deprecated: true,
          deprecationMessage: "use `delays` option instead",
          markdownDescription: delayDescription,
        }),
        delays: z.array(z.string()).meta({
          markdownDescription: delaysDescription,
        }),
        maxSplit: z.string().or(z.number()).meta({
          markdownDescription: maxSplitDescription,
        }),
      })
      .meta({
        defaultSnippets: [
          {
            label: "tlshello 100-200",
            description: "a fragmentation example from docs",
            body: {
              packets: "tlshello",
              lengths: ["3-5", "6-8", "10-20"],
              delays: ["10-20"],
              maxSplit: "3-6",
            },
          },
        ],
        markdownDescription: fragmentDescription,
      }),
  })
  .meta({
    markdownDescription: fragmentDescription,
  });

export const tcpFinalmask = z
  .array(z.discriminatedUnion("type", [tcpHeaderCustom, tcpFragment, sudoku]))
  .meta({
    markdownDescription: tcpFinalmaskDescription,
  });

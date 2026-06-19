import z from "zod";
import { headerCustomSettingsObject } from "./customSettingsObject.ts";
import { sudoku } from "./sudoku.ts";
import tcpFinalmaskDescription from "./tcpFinalmask.md?raw";
import tcpTypeDescription from "./tcpType.md?raw";
import headerCustomTcpDescription from "./headerCustomTcp.md?raw";
import fragmentDescription from "./fragment.md?raw";
import packetsDescription from "./packets.md?raw";
import lengthDescription from "./length.md?raw";
import delayDescription from "./delay.md?raw";
import maxSplitDescription from "./maxSplit.md?raw";

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
        length: z.string().meta({
          markdownDescription: lengthDescription,
        }),
        delay: z.string().meta({
          markdownDescription: delayDescription,
        }),
        maxSplit: z.string().meta({
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
              length: "100-200",
              delay: "10-20",
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

import z from "zod";
import { tcpFinalmask } from "./tcpFinalmask.ts";
import { udpFinalmask } from "./udpFinalmask.ts";
import { quicParams } from "./quicParams.ts";
import finalmaskDescription from "./finalmask.md?raw";
import finalmaskObjectDescription from "./finalmaskObject.md?raw";

export const finalmask = z
  .object({
    tcp: tcpFinalmask.optional().meta({
      markdownDescription: finalmaskObjectDescription,
    }),
    udp: udpFinalmask.optional().meta({
      markdownDescription: finalmaskObjectDescription,
    }),
    quicParams: quicParams.optional().meta({
      markdownDescription: finalmaskObjectDescription,
    }),
  })
  .meta({
    markdownDescription: finalmaskDescription,
  });

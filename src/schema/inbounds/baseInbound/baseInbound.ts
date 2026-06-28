import z from "zod";
import { sniffingSchema } from "../sniffing/sniffing.ts";
import { streamSettings } from "../../transport/transport.ts";
import inboundTagDescription from "./tag.md?raw";
import listenDescription from "./listen.md?raw";
import portDescription from "./port.md?raw";
import streamSettingsDescription from "./streamSettings.md?raw";
import sniffingDescription from "./sniffing.md?raw";

export const portLikeSchema = z.union([
  z.number().int().min(1).max(65535),
  z.string().regex(/^\d+(?:-\d+)?(?:,\d+(?:-\d+)?)*$/),
  z.string().regex(/^env:[A-Za-z_][A-Za-z0-9_]*$/),
]);

export const generalInboundSchema = z.object({
  tag: z.string().optional().meta({
    markdownDescription: inboundTagDescription,
  }),
  listen: z.string().optional().meta({
    markdownDescription: listenDescription,
  }),
  port: portLikeSchema.optional().meta({
    markdownDescription: portDescription,
  }),
  streamSettings: streamSettings.optional().meta({
    markdownDescription: streamSettingsDescription,
  }),
  sniffing: sniffingSchema.optional().meta({
    markdownDescription: sniffingDescription,
  }),
});

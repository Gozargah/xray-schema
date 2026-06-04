import z from "zod";
import customSettingsObjectDescription from "./customSettingsObject.md?raw";
import delayDescription from "./delay.md?raw";
import randDescription from "./rand.md?raw";
import randRangeDescription from "./randRange.md?raw";
import typeDescription from "./type.md?raw";
import packetDescription from "./packet.md?raw";

// TODO: add default snippet
export const headerCustomSettingsObject = z
  .object({
    delay: z.int().default(0).optional().meta({
      markdownDescription: delayDescription,
    }),
    rand: z.int().default(0).optional().meta({
      markdownDescription: randDescription,
    }),
    randRange: z.string().default("0-255").optional().meta({
      markdownDescription: randRangeDescription,
    }),
    type: z.enum(["array", "str", "hex", "base64"]).default("array").optional().meta({
      markdownDescription: typeDescription,
    }),
    packet: z.array(z.any()).optional().meta({
      markdownDescription: packetDescription,
    }),
  })
  .meta({
    markdownDescription: customSettingsObjectDescription,
  });

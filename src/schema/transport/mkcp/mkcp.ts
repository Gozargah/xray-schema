import z from "zod";
import mkcpDescription from "./mkcp.md?raw";
import kcpSettingsDescription from "./kcpSettings.md?raw";
import mtuDescription from "./mtu.md?raw";
import ttiDescription from "./tti.md?raw";
import uplinkCapacityDescription from "./uplinkCapacity.md?raw";
import downlinkCapacityDescription from "./downlinkCapacity.md?raw";
import congestionDescription from "./congestion.md?raw";
import readBufferSizeDescription from "./readBufferSize.md?raw";
import writeBufferSizeDescription from "./writeBufferSize.md?raw";
import cwndMultiplierDescription from "./cwndMultiplier.md?raw";
import maxSendingWindowDescription from "./maxSendingWindow.md?raw";
import networkDescription from "../methodField.md?raw";
import { transportBase } from "../base";

export const mkcpStream = transportBase
  .extend({
    method: z.literal("kcp").or(z.literal("mkcp")).meta({
      markdownDescription: networkDescription,
    }),
    kcpSettings: z
      .object({
        mtu: z
          .number()
          .int()
          .nonnegative()
          .default(1350)
          .optional()
          .meta({ markdownDescription: mtuDescription }),
        tti: z
          .number()
          .int()
          .nonnegative()
          .default(50)
          .optional()
          .meta({ markdownDescription: ttiDescription }),
        uplinkCapacity: z
          .number()
          .int()
          .nonnegative()
          .default(5)
          .optional()
          .meta({ markdownDescription: uplinkCapacityDescription }),
        downlinkCapacity: z
          .number()
          .int()
          .nonnegative()
          .default(20)
          .optional()
          .meta({ markdownDescription: downlinkCapacityDescription }),
        congestion: z
          .boolean()
          .default(false)
          .optional()
          .meta({ markdownDescription: congestionDescription, deprecated: true }),
        readBufferSize: z
          .number()
          .int()
          .nonnegative()
          .default(2)
          .optional()
          .meta({ markdownDescription: readBufferSizeDescription, deprecated: true }),
        writeBufferSize: z
          .number()
          .int()
          .nonnegative()
          .default(2)
          .optional()
          .meta({ markdownDescription: writeBufferSizeDescription, deprecated: true }),
        cwndMultiplier: z
          .number()
          .int()
          .nonnegative()
          .default(1)
          .optional()
          .meta({ markdownDescription: cwndMultiplierDescription }),
        maxSendingWindow: z
          .number()
          .int()
          .nonnegative()
          .default(2097152)
          .optional()
          .meta({ markdownDescription: maxSendingWindowDescription }),
      })
      .optional()
      .meta({ markdownDescription: kcpSettingsDescription }),
  })
  .meta({ markdownDescription: mkcpDescription });

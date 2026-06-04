import z from "zod";
import randomDescription from "./random.md?raw";
import roundRobinDescription from "./roundRobin.md?raw";
import leastPingDescription from "./leastPing.md?raw";
import leastLoadDescription from "./leastLoad.md?raw";
import { leastLoadSettingsObject } from "./leastLoadSettingsObject.ts";

export const strategyObject = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("random").meta({ markdownDescription: randomDescription }),
  }),
  z.object({
    type: z.literal("roundRobin").meta({ markdownDescription: roundRobinDescription }),
  }),
  z.object({
    type: z.literal("leastPing").meta({ markdownDescription: leastPingDescription }),
  }),
  z.object({
    type: z.literal("leastLoad").meta({ markdownDescription: leastLoadDescription }),
    settings: leastLoadSettingsObject.optional(),
  }),
]);

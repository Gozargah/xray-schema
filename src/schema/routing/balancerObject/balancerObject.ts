import z from "zod";
import tagDescription from "./tag.md?raw";
import selectorDescription from "./selector.md?raw";
import fallbackTagDescription from "./fallbackTag.md?raw";
import { strategyObject } from "./strategyObject/strategyObject.ts";

export const balancerObject = z.object({
  tag: z.string().optional().meta({ markdownDescription: tagDescription }),
  selector: z.array(z.string()).optional().meta({ markdownDescription: selectorDescription }),
  fallbackTag: z.string().optional().meta({ markdownDescription: fallbackTagDescription }),
  strategy: strategyObject,
});

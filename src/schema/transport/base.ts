import z from "zod";
import { finalmask } from "./finalmask/finalmask.ts";
import { sockopt } from "./sockopt/sockopt.ts";
import finalmaskFieldDescription from "./finalmaskField.md?raw";
import sockoptFieldDescription from "./sockoptField.md?raw";

export const transportBase = z.object({
  finalmask: finalmask.optional().meta({
    markdownDescription: finalmaskFieldDescription,
  }),
  sockopt: sockopt.optional().meta({
    markdownDescription: sockoptFieldDescription,
  }),
});

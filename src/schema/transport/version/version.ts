import z from "zod";
import markdownDescription from "./version.md?raw";

export const versionSchema = z
  .object({
    min: z.string().optional(),
    max: z.string().optional(),
  })
  .meta({
    markdownDescription,
  });

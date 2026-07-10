import z from "zod";
import envDescription from "./env.md?raw";

export const envSchema = z.record(z.string(), z.string()).meta({
  markdownDescription: envDescription,
});

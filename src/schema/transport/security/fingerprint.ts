import z from "zod";

export const fingerprintSchema = z
  .enum([
    "chrome",
    "firefox",
    "safari",
    "ios",
    "android",
    "edge",
    "360",
    "qq",
    "random",
    "randomized",
  ])
  .or(z.string());

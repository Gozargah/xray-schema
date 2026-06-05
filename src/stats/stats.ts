import z from "zod";

export const stats = z
  .object({})
  .loose()
  .meta({
    markdownDescription: `Currently, statistics do not require any parameters. As long as the StatsObject item exists, internal statistics are enabled.

After enabling statistics, you only need to enable the corresponding items in Policy to collect the corresponding data.`,
  });

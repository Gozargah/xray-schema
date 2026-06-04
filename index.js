import { xraySchema } from "./dist/full/index.mjs";
import fs from "fs";

fs.writeFileSync(
  "./schema.json",
  JSON.stringify(
    xraySchema.toJSONSchema({
      unrepresentable: "any",
      reused: "ref",
      target: "draft-07",
    }),
  ),
  { encoding: "utf-8" },
);

import raw from "unplugin-raw/rolldown";
import { defineConfig } from "tsdown";
import { removeMetaCalls } from "./build-tools/strip-meta.ts";
import { stripDefaultSnippets } from "./build-tools/strip-default-snippets.ts";
import { generateJsonSchema } from "./build-tools/json-schema-generator.ts";

export default defineConfig([
  {
    entry: ["src/index.ts"],
    platform: "neutral",
    outDir: "dist/full",
    plugins: [raw(), generateJsonSchema()],
    publint: true,
  },
  {
    entry: ["src/index.ts"],
    platform: "neutral",
    outDir: "dist/with-docs",
    plugins: [raw(), stripDefaultSnippets(), generateJsonSchema()],
    publint: true,
  },
  {
    entry: [
      "src/index.ts",
      "src/link/index.ts",
      "src/link/vless.ts",
      "src/link/vmess.ts",
      "src/link/trojan.ts",
      "src/link/shadowsocks.ts",
      "src/link/socks.ts",
      "src/link/wireguard.ts",
      "src/link/hysteria2.ts",
    ],
    platform: "neutral",
    outDir: "dist",
    plugins: [raw(), removeMetaCalls(), generateJsonSchema()],
    publint: true,
  },
]);

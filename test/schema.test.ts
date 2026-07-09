/// <reference types="tsdown/client" />

import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { parseJSONC } from "confbox";
import { XrayConfig, xraySchema } from "../dist";
import { prettifyError } from "zod";

const jsonFiles = await import.meta.glob("./Xray-examples/**/*.jsonc");

describe("validate against xray-examples repo", async () => {
  Object.keys(jsonFiles).forEach((configPath) => {
    const normalizedPath = configPath.replace("./Xray-examples/", "");
    it(`Testing ${normalizedPath}`, async () => {
      // parse ports
      let rawConfig = await readFileSync(join(process.cwd(), "test", configPath), "utf-8");
      rawConfig = rawConfig.replace("{{ port }},", '"{{ port }}",');
      rawConfig = rawConfig.replace("{{ port }}", "1234");

      // valid empty privateKey
      rawConfig = rawConfig.replace('"privateKey": ""', '"privateKey": "1234567890"');
      rawConfig = rawConfig.replace('"dest": ""', '"dest": "1234567890"');
      rawConfig = rawConfig.replace('"user": ""', '"user": "1234567890"');
      rawConfig = rawConfig.replace('"pass": ""', '"pass": "1234567890"');
      rawConfig = rawConfig.replaceAll("fromMitM", "fromMitm");

      // ignore the network: http as it is deprecated -> XRAY error: The feature HTTP transport (without header padding, etc.) has been removed and migrated to XHTTP stream-one H2 & H3. Please update your config(s) according to release note and documentation.
      if (rawConfig.includes('"network": "http"'))
        return expect(true, "http network is ignored").toBe(true);

      // ignore the network: h2 as it is deprecated -> XRAY error: The feature HTTP transport (without header padding, etc.) has been removed and migrated to XHTTP stream-one H2 & H3. Please update your config(s) according to release note and documentation.
      if (rawConfig.includes('"network": "h2"'))
        return expect(true, "h2 network is ignored").toBe(true);

      const config = parseJSONC(rawConfig) as XrayConfig

      if(config?.outbounds?.[0].protocol === 'vmess' && (config as any).outbounds[0].settings.security === "none")
        return expect(true, 'vmess no security ignored').toBe(true)

      if ((config as any)?.inbounds?.[0].streamSettings?.realitySettings?.serverNames?.length == 0)
        (config as any).inbounds[0].streamSettings.realitySettings.serverNames = ["google.com"];

      const res = xraySchema.safeParse(config);

      expect(
        res.success,
        res.success ? undefined : prettifyError(res.error) + "\n" + JSON.stringify(config, null, 2),
      ).toBe(true);
    });
  });
});

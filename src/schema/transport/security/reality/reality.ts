import z from "zod";
import securityDescription from "../../securityField.md?raw";
import { fingerprintSchema } from "../fingerprint.ts";
import realityDescription from "./reality.md?raw";
import realitySettingsDescription from "./realitySettings.md?raw";
import showDescription from "./show.md?raw";
import targetDescription from "./target.md?raw";
import xverDescription from "./xver.md?raw";
import serverNamesDescription from "./serverNames.md?raw";
import privateKeyDescription from "./privateKey.md?raw";
import minClientVerDescription from "./minClientVer.md?raw";
import maxClientVerDescription from "./maxClientVer.md?raw";
import maxTimeDiffDescription from "./maxTimeDiff.md?raw";
import shortIdsDescription from "./shortIds.md?raw";
import mldsa65SeedDescription from "./mldsa65Seed.md?raw";
import limitFallbackObjectDescription from "./limitFallbackObject.md?raw";
import limitFallbackUploadDescription from "./limitFallbackUpload.md?raw";
import limitFallbackDownloadDescription from "./limitFallbackDownload.md?raw";
import afterBytesDescription from "./afterBytes.md?raw";
import bytesPerSecDescription from "./bytesPerSec.md?raw";
import burstBytesPerSecDescription from "./burstBytesPerSec.md?raw";
import serverNameDescription from "./serverName.md?raw";
import fingerprintDescription from "./fingerprint.md?raw";
import shortIdDescription from "./shortId.md?raw";
import passwordDescription from "./password.md?raw";
import publicKeyDescription from "./publicKey.md?raw";
import mldsa65VerifyDescription from "./mldsa65Verify.md?raw";
import spiderXDescription from "./spiderX.md?raw";

const limitFallbackObject = z
  .object({
    afterBytes: z.number().int().nonnegative().default(0).optional().meta({
      markdownDescription: afterBytesDescription,
    }),
    bytesPerSec: z.number().int().nonnegative().default(0).optional().meta({
      markdownDescription: bytesPerSecDescription,
    }),
    burstBytesPerSec: z.number().int().nonnegative().default(0).optional().meta({
      markdownDescription: burstBytesPerSecDescription,
    }),
  })
  .optional()
  .meta({
    markdownDescription: limitFallbackObjectDescription,
  });

const realitySettingsServer = z.object({
  show: z.boolean().default(false).optional().meta({
    markdownDescription: showDescription,
  }),
  target: z.string().min(1).optional().meta({
    markdownDescription: targetDescription,
  }),
  dest: z.string().min(1).optional().meta({
    markdownDescription: targetDescription,
  }),
  xver: z.number().default(0).optional().meta({
    markdownDescription: xverDescription,
  }),
  serverNames: z.array(z.string()).min(1).meta({
    markdownDescription: serverNamesDescription,
  }),
  privateKey: z.string().min(1).meta({
    markdownDescription: privateKeyDescription,
  }),
  minClientVer: z.string().optional().meta({
    markdownDescription: minClientVerDescription,
  }),
  maxClientVer: z.string().optional().meta({
    markdownDescription: maxClientVerDescription,
  }),
  maxTimeDiff: z.number().int().nonnegative().default(0).optional().meta({
    markdownDescription: maxTimeDiffDescription,
  }),
  shortIds: z.array(z.string()).min(1).meta({
    markdownDescription: shortIdsDescription,
  }),
  mldsa65Seed: z.string().default("").optional().meta({
    markdownDescription: mldsa65SeedDescription,
  }),
  limitFallbackUpload: limitFallbackObject.optional().meta({
    markdownDescription: limitFallbackUploadDescription,
  }),
  limitFallbackDownload: limitFallbackObject.optional().meta({
    markdownDescription: limitFallbackDownloadDescription,
  }),
});

const base = z.object({
  serverName: z.string().optional().meta({
    markdownDescription: serverNameDescription,
  }),
  fingerprint: fingerprintSchema.optional().meta({
    markdownDescription: fingerprintDescription,
  }),
  shortId: z.string().meta({
    markdownDescription: shortIdDescription,
  }),
  mldsa65Verify: z.string().optional().meta({
    markdownDescription: mldsa65VerifyDescription,
  }),
  spiderX: z.string().optional().meta({
    markdownDescription: spiderXDescription,
  }),
});

const realitySettingsClient = z.union([
  base.merge(
    z.object({
      password: z.string().meta({
        markdownDescription: passwordDescription,
      }),
    }),
  ),
  base.merge(
    z.object({
      publicKey: z.string().meta({
        markdownDescription: publicKeyDescription,
      }),
    }),
  ),
]);

// TODO: distinguish inbound or outbound using of this
// realitySettingsServer for inbound
// realitySettingsClient for outbound
// is the reality settings optional at all?
export const reality = z
  .object({
    security: z.literal("reality").meta({
      markdownDescription: securityDescription,
    }),
    realitySettings: realitySettingsServer.or(realitySettingsClient).meta({
      markdownDescription: realitySettingsDescription,
    }),
  })
  .meta({
    markdownDescription: realityDescription,
  });

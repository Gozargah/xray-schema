import z from "zod";
import securityDescription from "../../securityField.md?raw";
import { sockopt } from "../../sockopt/sockopt.ts";
import { fingerprintSchema } from "../fingerprint.ts";
import tlsDescription from "./tls.md?raw";
import tlsSettingsDescription from "./tlsSettings.md?raw";
import certificateObjectDescription from "./certificateObject.md?raw";
import ocspStaplingDescription from "./ocspStapling.md?raw";
import oneTimeLoadingDescription from "./oneTimeLoading.md?raw";
import usageDescription from "./usage.md?raw";
import buildChainDescription from "./buildChain.md?raw";
import certificateFileDescription from "./certificateFile.md?raw";
import keyFileDescription from "./keyFile.md?raw";
import certificateDescription from "./certificate.md?raw";
import keyDescription from "./key.md?raw";
import serverNameDescription from "./serverName.md?raw";
import verifyPeerCertByNameDescription from "./verifyPeerCertByName.md?raw";
import rejectUnknownSniDescription from "./rejectUnknownSni.md?raw";
import alpnDescription from "./alpn.md?raw";
import minVersionDescription from "./minVersion.md?raw";
import maxVersionDescription from "./maxVersion.md?raw";
import cipherSuitesDescription from "./cipherSuites.md?raw";
import certificatesDescription from "./certificates.md?raw";
import disableSystemRootDescription from "./disableSystemRoot.md?raw";
import enableSessionResumptionDescription from "./enableSessionResumption.md?raw";
import fingerprintDescription from "./fingerprint.md?raw";
import pinnedPeerCertSha256Description from "./pinnedPeerCertSha256.md?raw";
import curvePreferencesDescription from "./curvePreferences.md?raw";
import masterKeyLogDescription from "./masterKeyLog.md?raw";
import echServerKeysDescription from "./echServerKeys.md?raw";
import echConfigListDescription from "./echConfigList.md?raw";
import echSockoptDescription from "./echSockopt.md?raw";

const certificateObject = z
  .object({
    ocspStapling: z.number().int().nonnegative().default(0).optional().meta({
      markdownDescription: ocspStaplingDescription,
    }),
    oneTimeLoading: z.boolean().default(false).optional().meta({
      markdownDescription: oneTimeLoadingDescription,
    }),
    usage: z.enum(["encipherment", "verify", "issue"]).default("encipherment").optional().meta({
      markdownDescription: usageDescription,
    }),
    buildChain: z.boolean().default(false).optional().meta({
      markdownDescription: buildChainDescription,
    }),
    certificateFile: z.string().optional().meta({
      markdownDescription: certificateFileDescription,
    }),
    keyFile: z.string().optional().meta({
      markdownDescription: keyFileDescription,
    }),
    certificate: z.array(z.string()).optional().meta({
      markdownDescription: certificateDescription,
    }),
    key: z.array(z.string()).optional().meta({
      markdownDescription: keyDescription,
    }),
  })
  .meta({
    markdownDescription: certificateObjectDescription,
  });

export const tls = z
  .object({
    security: z.literal("tls").meta({
      markdownDescription: securityDescription,
    }),
    tlsSettings: z
      .object({
        serverName: z.string().or(z.literal("fromMitm")).default("").optional().meta({
          markdownDescription: serverNameDescription,
        }),
        verifyPeerCertByName: z.string().or(z.literal("fromMitm")).optional().meta({
          markdownDescription: verifyPeerCertByNameDescription,
        }),
        rejectUnknownSni: z.boolean().default(false).optional().meta({
          markdownDescription: rejectUnknownSniDescription,
        }),
        allowInsecure: z.boolean().default(false).optional().meta({
          deprecated: true,
          deprecationMessage: `This option is deprecated. Use \`pinnedPeerCertSha256\` to specify the certificate manually instead.`,
        }),
        alpn: z
          .array(z.enum(["http/1.1", "h2", "h3", "fromMitm"]))
          .default(["h2", "http/1.1"])
          .optional()
          .meta({
            markdownDescription: alpnDescription,
          }),
        minVersion: z.string().optional().meta({
          markdownDescription: minVersionDescription,
        }),
        maxVersion: z.string().optional().meta({
          markdownDescription: maxVersionDescription,
        }),
        cipherSuites: z.string().optional().meta({
          markdownDescription: cipherSuitesDescription,
        }),
        certificates: z.array(certificateObject).optional().meta({
          markdownDescription: certificatesDescription,
        }),
        disableSystemRoot: z.boolean().default(false).optional().meta({
          markdownDescription: disableSystemRootDescription,
        }),
        enableSessionResumption: z.boolean().default(false).optional().meta({
          markdownDescription: enableSessionResumptionDescription,
        }),
        fingerprint: fingerprintSchema.optional().meta({
          markdownDescription: fingerprintDescription,
        }),
        pinnedPeerCertSha256: z.string().optional().meta({
          markdownDescription: pinnedPeerCertSha256Description,
        }),
        curvePreferences: z
          .array(
            z.enum([
              "CurveP256",
              "CurveP384",
              "CurveP521",
              "X25519",
              "X25519MLKEM768",
              "SecP256r1MLKEM768*",
              "SecP384r1MLKEM1024*",
            ]),
          )
          .optional()
          .meta({
            markdownDescription: curvePreferencesDescription,
          }),
        masterKeyLog: z.string().optional().meta({
          markdownDescription: masterKeyLogDescription,
        }),
        echServerKeys: z.string().optional().meta({
          markdownDescription: echServerKeysDescription,
        }),
        echConfigList: z.string().optional().meta({
          markdownDescription: echConfigListDescription,
        }),
        echSockopt: sockopt.optional().meta({
          markdownDescription: echSockoptDescription,
        }),
      })
      .optional()
      .meta({
        markdownDescription: tlsSettingsDescription,
      }),
  })
  .meta({
    markdownDescription: tlsDescription,
  });

import z from "zod";
import { outboundSchemaBase } from "../baseOutbound/baseOutbound";
import { portLikeSchema } from "../../inbounds/baseInbound/baseInbound";
import { sniffingSchema } from "../../inbounds/sniffing/sniffing";
import vlessDescription from "./vless.md?raw";
import vlessSettingsDescription from "./vlessSettings.md?raw";
import vlessAddressDescription from "./vlessAddress.md?raw";
import vlessPortDescription from "./vlessPort.md?raw";
import vlessIdDescription from "./vlessId.md?raw";
import vlessEncryptionDescription from "./vlessEncryption.md?raw";
import vlessFlowDescription from "./vlessFlow.md?raw";
import vlessLevelDescription from "./vlessLevel.md?raw";
import vlessReverseDescription from "./vlessReverse.md?raw";
import vlessReverseTagDescription from "./vlessReverseTag.md?raw";

const vlessSettings = z
  .object({
    address: z.string().meta({
      markdownDescription: vlessAddressDescription,
    }),
    port: portLikeSchema.meta({
      markdownDescription: vlessPortDescription,
    }),
    id: z.string().meta({
      markdownDescription: vlessIdDescription,
    }),
    encryption: z.string().default("none").meta({
      markdownDescription: vlessEncryptionDescription,
    }),
    flow: z.enum(["", "xtls-rprx-vision", "xtls-rprx-vision-udp443"]).optional().meta({
      markdownDescription: vlessFlowDescription,
    }),
    level: z.int().default(0).optional().meta({
      markdownDescription: vlessLevelDescription,
    }),
    reverse: z
      .object({
        tag: z.string().meta({
          markdownDescription: vlessReverseTagDescription,
        }),
        sniffing: sniffingSchema.optional(),
      })
      .optional()
      .meta({
        markdownDescription: vlessReverseDescription,
      }),
  })
  .meta({
    markdownDescription: vlessSettingsDescription,
  });

const vnext = z.object({
  vnext: z.array(
    z.object({
      address: z.string().meta({
        markdownDescription: vlessAddressDescription,
      }),
      port: portLikeSchema.meta({
        markdownDescription: vlessPortDescription,
      }),
      users: z.array(
        z.object({
          id: z.string().meta({
            markdownDescription: vlessIdDescription,
          }),
          encryption: z.string().default("none").meta({
            markdownDescription: vlessEncryptionDescription,
          }),
          flow: z.enum(["", "xtls-rprx-vision", "xtls-rprx-vision-udp443"]).optional().meta({
            markdownDescription: vlessFlowDescription,
          }),
          level: z.int().default(0).optional().meta({
            markdownDescription: vlessLevelDescription,
          }),
        }),
      ),
    }),
  ),
});
export const vless = outboundSchemaBase
  .extend({
    protocol: z.literal("vless"),
    settings: vlessSettings.or(vnext).meta({
      markdownDescription: vlessSettingsDescription,
    }),
  })
  .meta({
    markdownDescription: vlessDescription,
  });

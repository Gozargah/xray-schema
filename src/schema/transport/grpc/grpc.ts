import z from "zod";
import grpcDescription from "./grpc.md?raw";
import authorityDescription from "./authority.md?raw";
import serviceNameDescription from "./serviceName.md?raw";
import multiModeDescription from "./multiMode.md?raw";
import userAgentDescription from "./user_agent.md?raw";
import idleTimeoutDescription from "./idle_timeout.md?raw";
import healthCheckTimeoutDescription from "./health_check_timeout.md?raw";
import permitWithoutStreamDescription from "./permit_without_stream.md?raw";
import initialWindowsSizeDescription from "./initial_windows_size.md?raw";
import methodDescription from "../methodField.md?raw";
import networkDescription from "../networkField.md?raw";
import grpcSettingsFieldDescription from "../grpcSettingsField.md?raw";
import { transportBase } from "../base";

export const grpcStream = transportBase
  .extend({
    network: z.literal("grpc").optional().meta({
      markdownDescription: networkDescription,
      deprecated: true,
      deprecationMessage: "Use 'method' instead of 'network'.",
    }),
    method: z.literal("grpc").meta({
      markdownDescription: methodDescription,
    }),
    grpcSettings: z
      .object({
        authority: z.string().optional().meta({
          markdownDescription: authorityDescription,
        }),
        serviceName: z.string().default("").optional().meta({
          markdownDescription: serviceNameDescription,
        }),
        multiMode: z.boolean().default(false).optional().meta({
          markdownDescription: multiModeDescription,
        }),
        user_agent: z.string().optional().meta({
          markdownDescription: userAgentDescription,
        }),
        idle_timeout: z
          .number()
          .int()
          .nonnegative()
          .transform((t) => (t && t < 10 ? 10 : t))
          .optional()
          .meta({
            markdownDescription: idleTimeoutDescription,
          }),
        health_check_timeout: z.number().int().nonnegative().default(20).optional().meta({
          markdownDescription: healthCheckTimeoutDescription,
        }),
        permit_without_stream: z.boolean().default(false).optional().meta({
          markdownDescription: permitWithoutStreamDescription,
        }),
        initial_windows_size: z.number().int().nonnegative().default(0).optional().meta({
          markdownDescription: initialWindowsSizeDescription,
        }),
      })
      .optional()
      .meta({
        markdownDescription: grpcSettingsFieldDescription,
      }),
  })
  .meta({
    markdownDescription: grpcDescription,
  });

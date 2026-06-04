import z from "zod";
import domainDescription from "./domain.md?raw";
import ipDescription from "./ip.md?raw";
import portDescription from "./port.md?raw";
import sourcePortDescription from "./sourcePort.md?raw";
import networkDescription from "./network.md?raw";
import sourceIPDescription from "./sourceIP.md?raw";
import userDescription from "./user.md?raw";
import vlessRouteDescription from "./vlessRoute.md?raw";
import inboundTagDescription from "./inboundTag.md?raw";
import protocolDescription from "./protocol.md?raw";
import attrsDescription from "./attrs.md?raw";
import processDescription from "./process.md?raw";
import outboundTagDescription from "./outboundTag.md?raw";
import balancerTagDescription from "./balancerTag.md?raw";
import ruleTagDescription from "./ruleTag.md?raw";
import webhookUrlDescription from "./webhookUrl.md?raw";
import webhookDeduplicationDescription from "./webhookDeduplication.md?raw";

export const routingRule = z
  .object({
    domain: z.array(z.string()).optional().meta({ markdownDescription: domainDescription }),
    ip: z.array(z.string()).optional().meta({ markdownDescription: ipDescription }),
    port: z
      .union([z.string(), z.number()])
      .optional()
      .meta({ markdownDescription: portDescription }),
    sourcePort: z
      .union([z.string(), z.number()])
      .optional()
      .meta({ markdownDescription: sourcePortDescription }),
    network: z
      .enum(["tcp", "udp", "tcp,udp"])
      .optional()
      .meta({ markdownDescription: networkDescription }),
    source: z.array(z.string()).optional().meta({ markdownDescription: sourceIPDescription }),
    sourceIP: z.array(z.string()).optional().meta({ markdownDescription: sourceIPDescription }),
    user: z.array(z.string()).optional().meta({ markdownDescription: userDescription }),
    vlessRoute: z.string().optional().meta({ markdownDescription: vlessRouteDescription }),
    inboundTag: z.array(z.string()).optional().meta({ markdownDescription: inboundTagDescription }),
    protocol: z.array(z.string()).optional().meta({ markdownDescription: protocolDescription }),
    attrs: z
      .record(z.string(), z.unknown())
      .optional()
      .meta({ markdownDescription: attrsDescription }),
    process: z.array(z.string()).optional().meta({ markdownDescription: processDescription }),
    outboundTag: z.string().optional().meta({ markdownDescription: outboundTagDescription }),
    balancerTag: z.string().optional().meta({ markdownDescription: balancerTagDescription }),
    ruleTag: z.string().optional().meta({ markdownDescription: ruleTagDescription }),
    webhook: z
      .object({
        url: z.string().meta({ markdownDescription: webhookUrlDescription }),
        deduplication: z
          .number()
          .optional()
          .meta({ markdownDescription: webhookDeduplicationDescription }),
        headers: z.object().loose().meta({
          markdownDescription: `HTTP request headers.`,
        }),
      })
      .optional(),
  })
  .loose();

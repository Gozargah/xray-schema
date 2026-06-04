import z from "zod";
import quicParamsDescription from "./quicParams.md?raw";
import congestionDescription from "./congestion.md?raw";
import bbrProfileDescription from "./bbrProfile.md?raw";
import debugDescription from "./debug.md?raw";
import brutalUpDescription from "./brutalUp.md?raw";
import brutalDownDescription from "./brutalDown.md?raw";
import udpHopDescription from "./udpHop.md?raw";
import udpHopPortsDescription from "./udpHopPorts.md?raw";
import udpHopIntervalDescription from "./udpHopInterval.md?raw";
import initStreamReceiveWindowDescription from "./initStreamReceiveWindow.md?raw";
import maxStreamReceiveWindowDescription from "./maxStreamReceiveWindow.md?raw";
import initConnectionReceiveWindowDescription from "./initConnectionReceiveWindow.md?raw";
import maxConnectionReceiveWindowDescription from "./maxConnectionReceiveWindow.md?raw";
import maxIdleTimeoutDescription from "./maxIdleTimeout.md?raw";
import keepAlivePeriodDescription from "./keepAlivePeriod.md?raw";
import disablePathMTUDiscoveryDescription from "./disablePathMTUDiscovery.md?raw";
import maxIncomingStreamsDescription from "./maxIncomingStreams.md?raw";

const udpHop = z
  .object({
    ports: z.string().meta({
      markdownDescription: udpHopPortsDescription,
    }),
    interval: z.number().or(z.string()).default(30).optional().meta({
      markdownDescription: udpHopIntervalDescription,
    }),
  })
  .meta({
    markdownDescription: udpHopDescription,
  });

export const quicParams = z
  .object({
    congestion: z.enum(["reno", "bbr", "brutal", "force-brutal"]).optional().meta({
      markdownDescription: congestionDescription,
    }),
    bbrProfile: z.enum(["conservative", "standard", "aggressive"]).optional().meta({
      markdownDescription: bbrProfileDescription,
    }),
    debug: z.boolean().default(false).optional().meta({
      markdownDescription: debugDescription,
    }),
    brutalUp: z.string().or(z.int()).default(0).optional().meta({
      markdownDescription: brutalUpDescription,
    }),
    brutalDown: z.string().or(z.int()).default(0).optional().meta({
      markdownDescription: brutalDownDescription,
    }),
    udpHop: udpHop.optional().meta({
      markdownDescription: udpHopDescription,
    }),
    initStreamReceiveWindow: z.int().default(8388608).optional().meta({
      markdownDescription: initStreamReceiveWindowDescription,
    }),
    maxStreamReceiveWindow: z.int().default(8388608).optional().meta({
      markdownDescription: maxStreamReceiveWindowDescription,
    }),
    initConnectionReceiveWindow: z.int().default(20971520).optional().meta({
      markdownDescription: initConnectionReceiveWindowDescription,
    }),
    maxConnectionReceiveWindow: z.int().default(20971520).optional().meta({
      markdownDescription: maxConnectionReceiveWindowDescription,
    }),
    maxIdleTimeout: z.int().default(30).optional().meta({
      markdownDescription: maxIdleTimeoutDescription,
    }),
    keepAlivePeriod: z.int().default(0).optional().meta({
      markdownDescription: keepAlivePeriodDescription,
    }),
    disablePathMTUDiscovery: z.boolean().default(false).optional().meta({
      markdownDescription: disablePathMTUDiscoveryDescription,
    }),
    maxIncomingStreams: z.int().min(8).default(1024).optional().meta({
      markdownDescription: maxIncomingStreamsDescription,
    }),
  })
  .meta({
    markdownDescription: quicParamsDescription,
  });

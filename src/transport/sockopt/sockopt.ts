import z from "zod";
import sockoptDescription from "./sockopt.md?raw";
import happyEyeballsDescription from "./happyEyeballs.md?raw";
import tryDelayMsDescription from "./tryDelayMs.md?raw";
import prioritizeIPv6Description from "./prioritizeIPv6.md?raw";
import interleaveDescription from "./interleave.md?raw";
import maxConcurrentTryDescription from "./maxConcurrentTry.md?raw";
import markDescription from "./mark.md?raw";
import tcpMaxSegDescription from "./tcpMaxSeg.md?raw";
import tcpFastOpenDescription from "./tcpFastOpen.md?raw";
import tproxyDescription from "./tproxy.md?raw";
import domainStrategyDescription from "./domainStrategy.md?raw";
import dialerProxyDescription from "./dialerProxy.md?raw";
import acceptProxyProtocolDescription from "./acceptProxyProtocol.md?raw";
import trustedXForwardedForDescription from "./trustedXForwardedFor.md?raw";
import tcpKeepAliveIdleDescription from "./tcpKeepAliveIdle.md?raw";
import tcpKeepAliveIntervalDescription from "./tcpKeepAliveInterval.md?raw";
import tcpUserTimeoutDescription from "./tcpUserTimeout.md?raw";
import tcpcongestionDescription from "./tcpcongestion.md?raw";
import interfaceDescription from "./interface.md?raw";
import V6OnlyDescription from "./V6Only.md?raw";
import tcpWindowClampDescription from "./tcpWindowClamp.md?raw";
import tcpMptcpDescription from "./tcpMptcp.md?raw";
import addressPortStrategyDescription from "./addressPortStrategy.md?raw";
import customSockoptDescription from "./customSockopt.md?raw";
import systemDescription from "./system.md?raw";
import networkDescription from "./network.md?raw";
import typeDescription from "./type.md?raw";
import levelDescription from "./level.md?raw";
import optDescription from "./opt.md?raw";
import valueDescription from "./value.md?raw";

const happyEyeballs = z
  .object({
    tryDelayMs: z.int().default(0).optional().meta({
      markdownDescription: tryDelayMsDescription,
    }),
    prioritizeIPv6: z.boolean().default(false).optional().meta({
      markdownDescription: prioritizeIPv6Description,
    }),
    interleave: z.int().default(1).optional().meta({
      markdownDescription: interleaveDescription,
    }),
    maxConcurrentTry: z.int().default(4).optional().meta({
      markdownDescription: maxConcurrentTryDescription,
    }),
  })
  .meta({
    markdownDescription: happyEyeballsDescription,
  });

const customSockoptObject = z
  .object({
    system: z.enum(["linux", "windows", "darwin", ""]).or(z.string()).optional().meta({
      markdownDescription: systemDescription,
    }),
    network: z.enum(["tcp", "tcp4", "tcp6", "udp", "udp4", "udp6", ""]).or(z.string()).optional().meta({
      markdownDescription: networkDescription,
    }),
    type: z.enum(["int", "str"]).meta({
      markdownDescription: typeDescription,
    }),
    level: z.string().or(z.int()).default("6").optional().meta({
      markdownDescription: levelDescription,
    }),
    opt: z.string().or(z.int()).meta({
      markdownDescription: optDescription,
    }),
    value: z.string().or(z.int()).meta({
      markdownDescription: valueDescription,
    }),
  })
  .meta({
    markdownDescription: customSockoptDescription,
  });

export const sockopt = z
  .object({
    mark: z.int().optional().meta({
      markdownDescription: markDescription,
    }),
    tcpMaxSeg: z.int().optional().meta({
      markdownDescription: tcpMaxSegDescription,
    }),
    tcpFastOpen: z.boolean().or(z.number()).optional().meta({
      markdownDescription: tcpFastOpenDescription,
    }),
    tproxy: z.enum(["redirect", "tproxy", "off"]).default("off").optional().meta({
      markdownDescription: tproxyDescription,
    }),
    domainStrategy: z
      .enum([
        "AsIs",
        "UseIP",
        "UseIPv6v4",
        "UseIPv6",
        "UseIPv4v6",
        "UseIPv4",
        "ForceIP",
        "ForceIPv6v4",
        "ForceIPv6",
        "ForceIPv4v6",
        "ForceIPv4",
      ])
      .default("AsIs")
      .optional()
      .meta({
        markdownDescription: domainStrategyDescription,
      }),
    happyEyeballs: happyEyeballs.default({}).optional().meta({
      markdownDescription: happyEyeballsDescription,
    }),
    dialerProxy: z.string().optional().meta({
      markdownDescription: dialerProxyDescription,
    }),
    acceptProxyProtocol: z.boolean().default(false).optional().meta({
      markdownDescription: acceptProxyProtocolDescription,
    }),
    trustedXForwardedFor: z.array(z.string()).optional().meta({
      markdownDescription: trustedXForwardedForDescription,
    }),
    tcpKeepAliveInterval: z.int().optional().meta({
      markdownDescription: tcpKeepAliveIntervalDescription,
    }),
    tcpKeepAliveIdle: z.int().optional().meta({
      markdownDescription: tcpKeepAliveIdleDescription,
    }),
    tcpUserTimeout: z.int().optional().meta({
      markdownDescription: tcpUserTimeoutDescription,
    }),
    tcpcongestion: z.enum(["bbr", "cubic", "reno", ""]).optional().meta({
      markdownDescription: tcpcongestionDescription,
    }),
    interface: z.string().optional().meta({
      markdownDescription: interfaceDescription,
    }),
    V6Only: z.boolean().default(false).optional().meta({
      markdownDescription: V6OnlyDescription,
    }),
    tcpWindowClamp: z.int().optional().meta({
      markdownDescription: tcpWindowClampDescription,
    }),
    tcpMptcp: z.boolean().default(false).optional().meta({
      markdownDescription: tcpMptcpDescription,
    }),
    addressPortStrategy: z
      .enum([
        "none",
        "SrvPortOnly",
        "SrvAddressOnly",
        "SrvPortAndAddress",
        "TxtPortOnly",
        "TxtAddressOnly",
        "TxtPortAndAddress",
        "none",
      ])
      .default("none")
      .optional()
      .meta({
        markdownDescription: addressPortStrategyDescription,
      }),
    customSockopt: z.array(customSockoptObject).optional().meta({
      markdownDescription: customSockoptDescription,
    }),
  })
  .meta({
    markdownDescription: sockoptDescription,
  });

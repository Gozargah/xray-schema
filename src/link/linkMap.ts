/**
 * Centralized link ↔ outbound mapping tree.
 *
 * This is the single source of truth for how link query params map to
 * nested Xray outbound `streamSettings` and `settings` fields.
 *
 * The tree has three top-level branches:
 *   - `security`:  tls / reality field mappings
 *   - `transport`: per-network transport field mappings (ws, grpc, tcp, kcp, …)
 *   - `protocols`: per-protocol credential/extra/defaults/legacy mappings
 *
 * Most nodes are pure data. Nodes that need imperative logic (nested
 * objects, array construction, cross-field conditions) carry a `transform`
 * or `extraTransform` with `parse`/`serialize` functions.
 *
 * The interpreter in `streamSettings.ts` walks this tree.
 */

import type { QueryParams, StreamSettings } from "./streamSettings.ts";

/* ================================================================== *
 * Shared transforms — reusable, attachable to any field node
 * ================================================================== */

const toBool = (v: string): boolean => v === "1";
const toInt = (v: string): number => Number(v);
const splitComma = (v: string): string[] =>
  v
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
const joinComma = (v: any[]): string => (Array.isArray(v) ? v.join(",") : String(v));
const parseJSON = (v: string): any => {
  try {
    return JSON.parse(v);
  } catch {
    return undefined;
  }
};
const stringifyJSON = (v: any): string | undefined => {
  try {
    return JSON.stringify(v);
  } catch {
    return undefined;
  }
};
const kcpHeader = (v: string): string => (v === "wechat-video" ? "wechat" : v);
const toMultiMode = (v: string): boolean => v === "multi";
const fromMultiMode = (v: any): string | undefined => (v ? "multi" : undefined);

export const transforms = {
  toBool,
  toInt,
  splitComma,
  joinComma,
  parseJSON,
  stringifyJSON,
  kcpHeader,
  toMultiMode,
  fromMultiMode,
};

/* ================================================================== *
 * Node type definitions
 * ================================================================== */

/** A leaf field mapping. String is shorthand for `{ path }`. */
export interface FieldNode {
  /** Dot-path into the settings object, e.g. "serverName" or "header.type". */
  path: string;
  /** Parse a link string value into the outbound value. */
  parse?: (v: string, ctx: ParseCtx) => any;
  /** Serialize an outbound value back to a link string. */
  serialize?: (v: any, ctx: SerializeCtx) => string | undefined;
  /** Default value when the link param is absent (parse) or outbound field is absent (serialize). */
  default?: any;
  /** Skip this field if another link param is present (cross-field guard). */
  skipIf?: string;
  /** This field participates in the SNI fallback chain. */
  sniFallback?: boolean;
}

/** A branch with declarative field mappings. */
export interface FieldsNode {
  /** The method literal to set on streamSettings. */
  network?: string;
  /** The settings object key, e.g. "wsSettings" or "tlsSettings". */
  settingsKey?: string;
  /** SNI hint: which field's value to use as transport-derived SNI. */
  sniHint?: string;
  /** Declarative field mappings: linkParam → FieldNode. */
  fields?: Record<string, FieldNode | string>;
  /** Override the entire branch with imperative logic. */
  transform?: BranchTransform;
  /** Runs AFTER fields — produces extra streamSettings keys (e.g. finalmask). */
  extraTransform?: ExtraTransform;
}

/** Override transform for complex transport nodes (tcp, hysteria). */
export interface BranchTransform {
  parse: (q: QueryParams, ctx: ParseCtx) => TransformResult;
  serialize: (settings: Record<string, any>, ss: StreamSettings) => QueryParams;
}

/** Post-fields transform (kcp finalmask). */
export interface ExtraTransform {
  parse: (q: QueryParams, ctx: ParseCtx) => Record<string, any>;
  serialize: (ss: StreamSettings) => QueryParams;
}

export interface TransformResult {
  settings?: Record<string, any>;
  finalmask?: Record<string, any>;
  sniHint?: string;
}

export interface ParseCtx {
  server?: string;
  authPassword?: string;
}

export interface SerializeCtx {
  ss: StreamSettings;
}

/* ================================================================== *
 * The tree
 * ================================================================== */

/* ── Security (tls / reality) ──────────────────────────────────── */

export const securityMap = {
  tls: {
    settingsKey: "tlsSettings",
    fields: {
      sni: { path: "serverName", sniFallback: true },
      fp: "fingerprint",
      alpn: { path: "alpn", parse: splitComma, serialize: joinComma },
      insecure: { path: "allowInsecure", parse: toBool, skipIf: "pcs" },
      ech: "echConfigList",
      vcn: "verifyPeerCertByName",
      pcs: "pinnedPeerCertSha256",
    },
  },
  reality: {
    settingsKey: "realitySettings",
    fields: {
      sni: { path: "serverName", sniFallback: true },
      fp: "fingerprint",
      pbk: "publicKey",
      sid: "shortId",
      spx: "spiderX",
      pqv: "mldsa65Verify",
    },
  },
} as const satisfies Record<string, FieldsNode>;

/* ── Transport (per network) ───────────────────────────────────── */

export const transportMap: Record<string, FieldsNode> = {
  /* Simple transports — pure declarative */
  ws: {
    network: "ws",
    settingsKey: "wsSettings",
    sniHint: "host",
    fields: {
      host: "host",
      path: { path: "path", default: "/" },
    },
  },
  websocket: {
    network: "ws",
    settingsKey: "wsSettings",
    sniHint: "host",
    fields: {
      host: "host",
      path: { path: "path", default: "/" },
    },
  },
  httpupgrade: {
    network: "httpupgrade",
    settingsKey: "httpupgradeSettings",
    sniHint: "host",
    fields: {
      host: "host",
      path: { path: "path", default: "/" },
    },
  },
  xhttp: {
    network: "xhttp",
    settingsKey: "xhttpSettings",
    sniHint: "host",
    fields: {
      host: "host",
      path: { path: "path", default: "/" },
      mode: "mode",
      extra: { path: "extra", parse: parseJSON, serialize: stringifyJSON },
    },
  },
  grpc: {
    network: "grpc",
    settingsKey: "grpcSettings",
    sniHint: "authority",
    fields: {
      serviceName: "serviceName",
      authority: "authority",
      mode: { path: "multiMode", parse: toMultiMode, serialize: fromMultiMode },
    },
  },

  /* Complex: tcp — header.request nesting */
  tcp: {
    network: "tcp",
    settingsKey: "tcpSettings",
    transform: {
      parse: (q) => {
        const headerType = q["headerType"];
        const host = q["host"];
        const path = q["path"];

        if (headerType === "http") {
          const hostList = host ? splitComma(host) : [];
          const pathList = path ? splitComma(path) : ["/"];
          return {
            settings: {
              header: {
                type: "http",
                request: {
                  version: "1.1",
                  method: "GET",
                  path: pathList,
                  headers: hostList.length ? { Host: hostList } : {},
                },
              },
            },
            sniHint: hostList[0],
          };
        }
        return {
          settings: { header: { type: "none" } },
          sniHint: host || undefined,
        };
      },
      serialize: (settings) => {
        const q: QueryParams = {};
        if (settings?.header?.type === "http") {
          q["headerType"] = "http";
          const req = settings.header.request;
          if (req?.headers?.Host) {
            q["host"] = joinComma(req.headers.Host);
          }
          if (req?.path && Array.isArray(req.path)) {
            q["path"] = req.path.join(",");
          }
        }
        return q;
      },
    },
  },

  /* Complex: raw — same as tcp but with rawSettings */
  raw: {
    network: "raw",
    settingsKey: "rawSettings",
    transform: {
      parse: (q) => {
        const headerType = q["headerType"];
        const host = q["host"];
        const path = q["path"];

        if (headerType === "http") {
          const hostList = host ? splitComma(host) : [];
          const pathList = path ? splitComma(path) : ["/"];
          return {
            settings: {
              header: {
                type: "http",
                request: {
                  version: "1.1",
                  method: "GET",
                  path: pathList,
                  headers: hostList.length ? { Host: hostList } : {},
                },
              },
            },
            sniHint: hostList[0],
          };
        }
        return {
          settings: { header: { type: "none" } },
          sniHint: host || undefined,
        };
      },
      serialize: (settings) => {
        const q: QueryParams = {};
        if (settings?.header?.type === "http") {
          q["headerType"] = "http";
          const req = settings.header.request;
          if (req?.headers?.Host) {
            q["host"] = joinComma(req.headers.Host);
          }
          if (req?.path && Array.isArray(req.path)) {
            q["path"] = req.path.join(",");
          }
        }
        return q;
      },
    },
  },

  /* Complex: kcp — fields + extraTransform for finalmask */
  kcp: {
    network: "kcp",
    settingsKey: "kcpSettings",
    fields: {
      mtu: { path: "mtu", parse: toInt },
      tti: { path: "tti", parse: toInt },
    },
    extraTransform: {
      parse: (q) => {
        const headerType = q["headerType"];
        const host = q["host"];
        const seed = q["seed"];
        const udp: any[] = [];

        if (headerType && headerType !== "none") {
          udp.push({
            type: "mkcp-legacy",
            settings: {
              header: kcpHeader(headerType),
              value: headerType === "dns" ? host || "" : "",
            },
          });
        }
        if (seed) {
          udp.push({
            type: "mkcp-legacy",
            settings: { header: "", value: seed },
          });
        }
        return udp.length > 0 ? { finalmask: { udp } } : {};
      },
      serialize: (ss) => {
        const q: QueryParams = {};
        const udp = ss.finalmask?.udp;
        if (Array.isArray(udp)) {
          for (const entry of udp) {
            if (entry?.type === "mkcp-legacy" && entry.settings) {
              const hdr = entry.settings.header;
              const val = entry.settings.value;
              if (hdr && hdr !== "") {
                q["headerType"] = hdr;
                if (hdr === "dns" && val) q["host"] = val;
              } else if (val) {
                q["seed"] = val;
              }
            }
          }
        }
        return q;
      },
    },
  },

  /* Complex: hysteria — auth + finalmask (salamander / quicParams) */
  hysteria: {
    network: "hysteria",
    settingsKey: "hysteriaSettings",
    transform: {
      parse: (q, ctx) => {
        const settings: Record<string, any> = {
          version: 2,
          auth: ctx.authPassword || "",
        };

        const obfsPassword = q["obfs-password"];
        const mport = q["mport"];
        const mportHopInt = q["mportHopInt"];

        const udp: any[] = [];
        if (obfsPassword) {
          udp.push({
            type: "salamander",
            settings: { password: obfsPassword },
          });
        }

        const quicParams: Record<string, any> = {};
        if (mport) {
          quicParams.udpHop = { ports: mport, interval: resolveHopInterval(mportHopInt) };
        }

        const finalmask: Record<string, any> = {};
        if (udp.length > 0) finalmask.udp = udp;
        if (Object.keys(quicParams).length > 0) finalmask.quicParams = quicParams;

        return {
          settings,
          finalmask: Object.keys(finalmask).length > 0 ? finalmask : undefined,
        };
      },
      serialize: (_settings, ss) => {
        const q: QueryParams = {};
        const fm = ss.finalmask;
        if (fm?.udp && Array.isArray(fm.udp)) {
          for (const entry of fm.udp) {
            if (entry?.type === "salamander" && entry.settings?.password) {
              q["obfs-password"] = entry.settings.password;
            }
          }
        }
        if (fm?.quicParams?.udpHop) {
          if (fm.quicParams.udpHop.ports) q["mport"] = fm.quicParams.udpHop.ports;
          if (fm.quicParams.udpHop.interval != null)
            q["mportHopInt"] = String(fm.quicParams.udpHop.interval);
        }
        return q;
      },
    },
  },
};

/* ── Protocols ─────────────────────────────────────────────────── */

export interface ProtocolNode {
  /** URI scheme prefix (e.g. "ss", "vless", "hysteria2"). */
  scheme: string;
  /** Zod protocol literal (e.g. "shadowsocks", "vless", "hysteria"). Defaults to scheme. */
  protocolName?: string;
  /** Single credential: URI username → outbound path. */
  credential?: { from: "username"; to: string };
  /** Composite credential: userinfo split on separator → multiple outbound paths. */
  compositeCredential?: {
    from: "userinfo";
    separator: string;
    /** Outbound paths for each split part, e.g. ["settings.method", "settings.password"]. */
    fields: string[];
    /** Whether the userinfo may be Base64-encoded (ss, socks). */
    mayBeBase64?: boolean;
  };
  /** Extra query params that map to settings fields. */
  extra?: Record<string, { to: string; default?: string }>;
  /** Force a default security value when absent. */
  defaultSecurity?: string;
  /** Forced streamSettings values (hysteria2: method, security, alpn). */
  forced?: Record<string, string>;
  /** VMess legacy JSON format: field aliases + per-network remapping. */
  legacy?: {
    aliases: Record<string, string>;
    networkRemap: Record<string, Record<string, string>>;
  };
}

export const protocolMap: Record<string, ProtocolNode> = {
  vless: {
    scheme: "vless",
    credential: { from: "username", to: "settings.id" },
    extra: {
      encryption: { to: "settings.encryption", default: "none" },
      flow: { to: "settings.flow" },
    },
  },
  trojan: {
    scheme: "trojan",
    credential: { from: "username", to: "settings.password" },
    defaultSecurity: "tls",
    extra: {
      flow: { to: "settings.flow" },
    },
  },
  vmess: {
    scheme: "vmess",
    credential: { from: "username", to: "settings.id" },
    extra: {
      encryption: { to: "settings.security", default: "auto" },
    },
    legacy: {
      aliases: {
        add: "address",
        port: "port",
        id: "id",
        scy: "encryption",
        net: "type",
        ps: "remarks",
        tls: "security",
        type: "headerType",
        host: "host",
        path: "path",
        mode: "mode",
        extra: "extra",
        sni: "sni",
        fp: "fp",
        alpn: "alpn",
        insecure: "insecure",
        vcn: "vcn",
        pcs: "pcs",
        pbk: "pbk",
        sid: "sid",
        spx: "spx",
        pqv: "pqv",
      },
      networkRemap: {
        kcp: { path: "seed", type: "headerType" },
        grpc: { type: "mode", path: "serviceName", host: "authority" },
      },
    },
  },
  hysteria2: {
    scheme: "hysteria2",
    protocolName: "hysteria",
    credential: { from: "username", to: "streamSettings.hysteriaSettings.auth" },
    forced: { type: "hysteria", security: "tls", alpn: "h3" },
  },
  shadowsocks: {
    scheme: "ss",
    protocolName: "shadowsocks",
    compositeCredential: {
      from: "userinfo",
      separator: ":",
      fields: ["settings.method", "settings.password"],
      mayBeBase64: true,
    },
  },
  socks: {
    scheme: "socks",
    compositeCredential: {
      from: "userinfo",
      separator: ":",
      fields: ["settings.user", "settings.pass"],
      mayBeBase64: true,
    },
  },
  wireguard: {
    scheme: "wireguard",
    credential: { from: "username", to: "settings.secretKey" },
  },
};

/* ================================================================== *
 * Helpers (used by transformers)
 * ================================================================== */

/** Naive domain-name check (has a dot, no colon/brackets). */
export function isDomainName(s: string): boolean {
  if (!s) return false;
  if (s.includes(":") || s.includes("[")) return false;
  return s.includes(".");
}

/**
 * Resolve port-hopping interval with v2rayNG's validation:
 *   - single int < 5 → default 30
 *   - range "a-b" → clamp start to ≥5, ensure end ≥ start
 *   - invalid → default 30
 */
function resolveHopInterval(raw: string | undefined): string | number {
  const DEFAULT = 30;
  if (!raw) return DEFAULT;
  const trimmed = raw.trim();
  const single = Number(trimmed);
  if (!isNaN(single) && String(single) === trimmed) {
    return single < 5 ? DEFAULT : trimmed;
  }
  const parts = trimmed.split("-");
  if (parts.length === 2 && parts[0] && parts[1]) {
    const start = Number(parts[0].trim());
    const end = Number(parts[1].trim());
    if (!isNaN(start) && !isNaN(end)) {
      const minStart = Math.max(5, start);
      const minEnd = Math.max(minStart, end);
      return `${minStart}-${minEnd}`;
    }
  }
  return DEFAULT;
}

/* ── Deprecated networks ───────────────────────────────────────── */

export const DEPRECATED_NETWORKS = new Set(["http", "h2"]);

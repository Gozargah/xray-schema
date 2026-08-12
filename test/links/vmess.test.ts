import { describe, it, expect } from "vitest";
import { parseVmess, generateVmess } from "../../src/link/vmess.ts";
import { xraySchema } from "../../src/schema.ts";

/* ------------------------------------------------------------------ *
 * Legacy Base64 JSON format tests
 * ------------------------------------------------------------------ */

// Helper: build a legacy vmess link from a plain object
function legacyLink(obj: Record<string, any>): string {
  return `vmess://${btoa(JSON.stringify(obj))}`;
}

const legacyLinks = [
  // Basic TCP + TLS
  legacyLink({
    v: "2", ps: "Basic", add: "example.com", port: "443",
    id: "0d3f1a2b-8c4e-4fa3-9d51-7b2e9f1a3c5d", scy: "auto",
    aid: "0", net: "tcp", type: "none", tls: "tls", sni: "example.com",
  }),
  // WS + TLS
  legacyLink({
    v: "2", ps: "WS", add: "1.2.3.4", port: "443",
    id: "uuid-1234", scy: "aes-128-gcm", aid: "0",
    net: "ws", host: "cdn.example.com", path: "/ws",
    tls: "tls", sni: "cdn.example.com",
  }),
  // gRPC (per-network remapping: type→mode, path→serviceName, host→authority)
  legacyLink({
    v: "2", ps: "gRPC", add: "grpc.example.com", port: "443",
    id: "grpc-uuid", scy: "auto", aid: "0",
    net: "grpc", type: "multi", path: "grpcService", host: "grpc.example.com",
    tls: "tls", sni: "grpc.example.com",
  }),
  // KCP (per-network remapping: path→seed)
  legacyLink({
    v: "2", ps: "KCP", add: "1.2.3.4", port: "18390",
    id: "kcp-uuid", scy: "auto", aid: "0",
    net: "kcp", type: "none", path: "mySecretSeed",
  }),
  // Reality
  legacyLink({
    v: "2", ps: "Reality", add: "example.com", port: "443",
    id: "reality-uuid", scy: "auto", aid: "0",
    net: "tcp", tls: "reality", sni: "www.google.com",
    fp: "chrome", pbk: "ABCdef123", sid: "0a1b2c", spx: "/path",
  }),
  // No security
  legacyLink({
    v: "2", ps: "NoTLS", add: "10.0.0.1", port: "8080",
    id: "simple-id", scy: "auto", aid: "0", net: "tcp", type: "none",
  }),
  // XHTTP + TLS
  legacyLink({
    v: "2", ps: "XHTTP", add: "xhttp.example.com", port: "443",
    id: "xhttp-uuid", scy: "auto", aid: "0",
    net: "xhttp", host: "xhttp.example.com", path: "/xhttp", mode: "auto",
    tls: "tls", sni: "xhttp.example.com",
  }),
  // HTTPUpgrade + TLS
  legacyLink({
    v: "2", ps: "HU", add: "hu.example.com", port: "443",
    id: "hu-uuid", scy: "auto", aid: "0",
    net: "httpupgrade", host: "hu.example.com", path: "/hu",
    tls: "tls", sni: "hu.example.com",
  }),
  // With insecure + alpn + fp
  legacyLink({
    v: "2", ps: "Insecure", add: "example.com", port: "443",
    id: "insecure-uuid", scy: "auto", aid: "0",
    net: "tcp", tls: "tls", sni: "example.com",
    fp: "chrome", alpn: "h2,http/1.1", insecure: "1",
  }),
];

describe("vmess legacy parse + zod validation", () => {
  for (const link of legacyLinks) {
    const obj = JSON.parse(atob(link.slice("vmess://".length)));
    const label = obj.ps || obj.add;
    it(`legacy validates: ${label}`, () => {
      const ob = parseVmess(link);
      const config = { outbounds: [ob] };
      const res = xraySchema.safeParse(config);
      expect(res.success, res.success ? "" : JSON.stringify(res.error.issues, null, 2)).toBe(true);
    });
  }
});

/* ------------------------------------------------------------------ *
 * Standard URI format tests
 * ------------------------------------------------------------------ */

const stdLinks = [
  "vmess://0d3f1a2b-8c4e-4fa3-9d51-7b2e9f1a3c5d@example.com:443?type=tcp&security=tls&sni=example.com&encryption=auto#StdBasic",
  "vmess://uuid-1234@1.2.3.4:8443?type=ws&security=tls&sni=cdn.example.com&host=cdn.example.com&path=%2Fws&encryption=aes-128-gcm#StdWS",
  "vmess://grpc-uuid@grpc.example.com:443?type=grpc&security=tls&sni=grpc.example.com&serviceName=grpcService&authority=grpc.example.com&mode=multi&encryption=auto#StdgRPC",
  "vmess://xhttp-uuid@xhttp.example.com:443?type=xhttp&security=tls&sni=xhttp.example.com&host=xhttp.example.com&path=%2Fxhttp&mode=auto&encryption=auto#StdXHTTP",
  "vmess://kcp-uuid@1.2.3.4:18390?type=kcp&seed=mySecretSeed&encryption=auto#StdKCP",
];

describe("vmess std URI parse + zod validation", () => {
  for (const link of stdLinks) {
    const label = link.slice(0, 60);
    it(`std validates: ${label}...`, () => {
      const ob = parseVmess(link);
      const config = { outbounds: [ob] };
      const res = xraySchema.safeParse(config);
      expect(res.success, res.success ? "" : JSON.stringify(res.error.issues, null, 2)).toBe(true);
    });
  }
});

/* ------------------------------------------------------------------ *
 * Per-network legacy remapping verification
 * ------------------------------------------------------------------ */

describe("vmess legacy per-network remapping", () => {
  it("KCP: path → seed in finalmask", () => {
    const ob: any = parseVmess(legacyLink({
      v: "2", ps: "K", add: "1.2.3.4", port: "18390",
      id: "u", scy: "auto", aid: "0", net: "kcp", path: "mySeed",
    }));
    expect(ob.streamSettings?.network).toBe("kcp");
    expect(ob.streamSettings?.finalmask?.udp?.[0]?.settings?.value).toBe("mySeed");
  });

  it("gRPC: type→mode, path→serviceName, host→authority", () => {
    const ob: any = parseVmess(legacyLink({
      v: "2", ps: "G", add: "g.com", port: "443",
      id: "u", scy: "auto", aid: "0",
      net: "grpc", type: "multi", path: "svc", host: "auth",
    }));
    expect(ob.streamSettings?.grpcSettings?.multiMode).toBe(true);
    expect(ob.streamSettings?.grpcSettings?.serviceName).toBe("svc");
    expect(ob.streamSettings?.grpcSettings?.authority).toBe("auth");
  });

  it("TCP http header: type→headerType, host→Host header, path→request.path", () => {
    const ob: any = parseVmess(legacyLink({
      v: "2", ps: "T", add: "1.2.3.4", port: "80",
      id: "u", scy: "auto", aid: "0",
      net: "tcp", type: "http", host: "www.example.com", path: "/api",
    }));
    expect(ob.streamSettings?.tcpSettings?.header?.type).toBe("http");
    expect(ob.streamSettings?.tcpSettings?.header?.request?.headers?.Host).toEqual(["www.example.com"]);
    expect(ob.streamSettings?.tcpSettings?.header?.request?.path).toEqual(["/api"]);
  });
});

/* ------------------------------------------------------------------ *
 * Security parsing
 * ------------------------------------------------------------------ */

describe("vmess security", () => {
  it("parses scy into settings.security", () => {
    const ob: any = parseVmess(legacyLink({
      v: "2", ps: "S", add: "a.com", port: "443",
      id: "u", scy: "chacha20-poly1305", aid: "0", net: "tcp",
    }));
    expect(ob.settings.security).toBe("chacha20-poly1305");
  });

  it("defaults scy to auto when empty", () => {
    const ob: any = parseVmess(legacyLink({
      v: "2", ps: "S", add: "a.com", port: "443",
      id: "u", aid: "0", net: "tcp",
    }));
    expect(ob.settings.security).toBe("auto");
  });

  it("std URI: encryption param → settings.security", () => {
    const ob: any = parseVmess("vmess://u@a.com:443?type=tcp&encryption=none#X");
    expect(ob.settings.security).toBe("none");
  });

  it("reality: pbk/sid/spx → realitySettings", () => {
    const ob: any = parseVmess(legacyLink({
      v: "2", ps: "R", add: "a.com", port: "443",
      id: "u", scy: "auto", aid: "0", net: "tcp",
      tls: "reality", sni: "g.com", fp: "chrome", pbk: "PK", sid: "SID", spx: "/x",
    }));
    expect(ob.streamSettings?.security).toBe("reality");
    expect(ob.streamSettings?.realitySettings?.publicKey).toBe("PK");
    expect(ob.streamSettings?.realitySettings?.shortId).toBe("SID");
    expect(ob.streamSettings?.realitySettings?.spiderX).toBe("/x");
  });
});

/* ------------------------------------------------------------------ *
 * Round-trip
 * ------------------------------------------------------------------ */

describe("vmess round-trip", () => {
  it("generateVmess(parseVmess(x)) produces equivalent outbound", () => {
    const link = legacyLink({
      v: "2", ps: "RT", add: "1.2.3.4", port: "443",
      id: "rt-uuid", scy: "aes-128-gcm", aid: "0",
      net: "ws", host: "cdn.example.com", path: "/ws",
      tls: "tls", sni: "cdn.example.com",
    });
    const ob: any = parseVmess(link);
    const regen = generateVmess(ob);
    const ob2: any = parseVmess(regen);

    expect(ob2.settings.address).toBe(ob.settings.address);
    expect(ob2.settings.port).toBe(ob.settings.port);
    expect(ob2.settings.id).toBe(ob.settings.id);
    expect(ob2.settings.security).toBe(ob.settings.security);
    expect(ob2.streamSettings?.network).toBe(ob.streamSettings?.network);
    expect(ob2.streamSettings?.security).toBe(ob.streamSettings?.security);
    expect(ob2.streamSettings?.wsSettings?.host).toBe(ob.streamSettings?.wsSettings?.host);
    expect(ob2.streamSettings?.wsSettings?.path).toBe(ob.streamSettings?.wsSettings?.path);
    expect(ob2.tag).toBe(ob.tag);
  });

  it("gRPC round-trip preserves serviceName/authority/multiMode", () => {
    const link = legacyLink({
      v: "2", ps: "RTg", add: "grpc.com", port: "443",
      id: "u", scy: "auto", aid: "0",
      net: "grpc", type: "multi", path: "svc", host: "auth",
      tls: "tls", sni: "grpc.com",
    });
    const ob: any = parseVmess(link);
    const regen = generateVmess(ob);
    const ob2: any = parseVmess(regen);

    expect(ob2.streamSettings?.grpcSettings?.serviceName).toBe("svc");
    expect(ob2.streamSettings?.grpcSettings?.authority).toBe("auth");
    expect(ob2.streamSettings?.grpcSettings?.multiMode).toBe(true);
  });

  it("KCP round-trip preserves seed", () => {
    const link = legacyLink({
      v: "2", ps: "RTk", add: "1.2.3.4", port: "18390",
      id: "u", scy: "auto", aid: "0",
      net: "kcp", path: "theSeed",
    });
    const ob: any = parseVmess(link);
    const regen = generateVmess(ob);
    const ob2: any = parseVmess(regen);

    expect(ob2.streamSettings?.finalmask?.udp?.[0]?.settings?.value).toBe("theSeed");
  });
});

/* ------------------------------------------------------------------ *
 * Error cases
 * ------------------------------------------------------------------ */

describe("vmess errors", () => {
  it("throws on invalid base64", () => {
    expect(() => parseVmess("vmess://!!!notbase64!!!")).toThrow();
  });

  it("throws on missing add", () => {
    expect(() => parseVmess(legacyLink({ v: "2", port: "443", id: "u", net: "tcp" }))).toThrow("add");
  });

  it("throws on missing id", () => {
    expect(() => parseVmess(legacyLink({ v: "2", add: "a.com", port: "443", net: "tcp" }))).toThrow("id");
  });

  it("throws on deprecated h2 transport", () => {
    expect(() => parseVmess(legacyLink({
      v: "2", ps: "H", add: "a.com", port: "443", id: "u", net: "h2",
    }))).toThrow("h2");
  });
});

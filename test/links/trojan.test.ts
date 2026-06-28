import { describe, it, expect } from "vitest";
import { parseTrojan, generateTrojan } from "../../src/link/trojan.ts";
import { xraySchema } from "../../src/schema.ts";

const validLinks = [
  // Default TLS + TCP (no query params)
  "trojan://password123@example.com:443#Basic",
  // TLS + WS
  "trojan://pass@1.2.3.4:443?type=ws&security=tls&sni=cdn.example.com&host=cdn.example.com&path=%2Fws#WS",
  // TLS + gRPC
  "trojan://pass@gRPC.example.com:443?type=grpc&security=tls&sni=gRPC.example.com&serviceName=grpcService&authority=gRPC.example.com#gRPC",
  // Reality + XHTTP
  "trojan://pass@example.com:443?type=xhttp&security=reality&sni=www.google.com&fp=chrome&pbk=ABCdef123&sid=0a1b2c&spx=%2Fpath#Reality",
  // TLS + TCP with flow
  "trojan://pass@example.com:443?type=tcp&security=tls&sni=example.com&flow=xtls-rprx-vision#Flow",
  // KCP with seed
  "trojan://pass@1.2.3.4:18390?type=kcp&seed=mySecretSeed#KCP",
  // TCP with http header
  "trojan://pass@1.2.3.4:80?type=tcp&headerType=http&host=www.example.com&path=%2Fapi#TCP-HTTP",
  // HTTPUpgrade + TLS
  "trojan://pass@1.2.3.4:443?type=httpupgrade&security=tls&sni=hu.example.com&host=hu.example.com&path=%2Fhu#HU",
  // Insecure + ALPN + fingerprint
  "trojan://pass@example.com:443?type=tcp&security=tls&sni=example.com&fp=chrome&alpn=h2%2Chttp%2F1.1&insecure=1#Insecure",
];

describe("trojan parse + zod validation", () => {
  for (const link of validLinks) {
    const label = link.slice(0, 60);
    it(`validates: ${label}...`, () => {
      const ob = parseTrojan(link);
      const config = { outbounds: [ob] };
      const res = xraySchema.safeParse(config);
      expect(res.success, res.success ? "" : JSON.stringify(res.error.issues, null, 2)).toBe(true);
    });
  }
});

describe("trojan default TLS", () => {
  it("defaults to tls+tcp when no query params", () => {
    const ob: any = parseTrojan("trojan://pass@example.com:443#Basic");
    expect(ob.streamSettings?.security).toBe("tls");
    expect(ob.streamSettings?.network).toBe("tcp");
    expect(ob.streamSettings?.tlsSettings).toBeDefined();
  });

  it("defaults to tls when query exists but security absent", () => {
    const ob: any = parseTrojan("trojan://pass@example.com:443?type=ws&host=cdn.example.com&path=%2Fws#WS");
    expect(ob.streamSettings?.security).toBe("tls");
    expect(ob.streamSettings?.network).toBe("ws");
  });
});

describe("trojan flow", () => {
  it("parses flow into settings.flow", () => {
    const ob: any = parseTrojan("trojan://pass@example.com:443?type=tcp&security=tls&flow=xtls-rprx-vision#Flow");
    expect(ob.settings.flow).toBe("xtls-rprx-vision");
  });

  it("validates flow against schema", () => {
    const ob: any = parseTrojan("trojan://pass@example.com:443?type=tcp&security=tls&flow=xtls-rprx-vision-udp443#Flow");
    const res = xraySchema.safeParse({ outbounds: [ob] });
    expect(res.success).toBe(true);
  });
});

describe("trojan round-trip", () => {
  it("generateLink(parseLink(x)) produces equivalent outbound", () => {
    const link = "trojan://pass@1.2.3.4:443?type=ws&security=tls&sni=cdn.example.com&host=cdn.example.com&path=%2Fws#WS";
    const ob: any = parseTrojan(link);
    const regen = generateTrojan(ob);
    const ob2: any = parseTrojan(regen);

    expect(ob2.settings.address).toBe(ob.settings.address);
    expect(ob2.settings.port).toBe(ob.settings.port);
    expect(ob2.settings.password).toBe(ob.settings.password);
    expect(ob2.streamSettings?.network).toBe(ob.streamSettings?.network);
    expect(ob2.streamSettings?.security).toBe(ob.streamSettings?.security);
    expect(ob2.streamSettings?.wsSettings?.host).toBe(ob.streamSettings?.wsSettings?.host);
    expect(ob2.streamSettings?.wsSettings?.path).toBe(ob.streamSettings?.wsSettings?.path);
  });
});

describe("trojan errors", () => {
  it("throws on missing password", () => {
    expect(() => parseTrojan("trojan://@example.com:443")).toThrow("missing password");
  });

  it("throws on missing port", () => {
    expect(() => parseTrojan("trojan://pass@example.com")).toThrow("server port");
  });

  it("throws on deprecated h2 transport", () => {
    expect(() => parseTrojan("trojan://pass@example.com:443?type=h2")).toThrow("h2");
  });
});

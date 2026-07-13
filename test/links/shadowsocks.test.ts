import { describe, it, expect } from "vitest";
import { parseShadowsocks, generateShadowsocks } from "../../src/link/shadowsocks.ts";
import { xraySchema } from "../../src/schema.ts";

/* ------------------------------------------------------------------ *
 * SIP002 format
 * ------------------------------------------------------------------ */

const b64 = (s: string) => btoa(s);

const sip002Links = [
  // Basic SIP002 with base64 userinfo
  `ss://${b64("aes-256-gcm:password123")}@example.com:8388#Basic`,
  // SIP002 with plain userinfo
  "ss://aes-128-gcm:pass@1.2.3.4:8388#Plain",
  // SIP002 with chacha20 method
  `ss://${b64("chacha20-poly1305:mypassword")}@server.example.com:443#ChaCha`,
  // SIP002 with none method (no longer valid)
  // `ss://${b64("none:")}@example.com:8080#None`,
  // SIP002 with 2022 method
  `ss://${b64("2022-blake3-aes-256-gcm:base64key==")}@example.com:443#2022`,
  // SIP002 with plugin obfs=http
  `ss://${b64("aes-256-gcm:password")}@example.com:443?plugin=obfs-local%3Bobfs%3Dhttp%3Bobfs-host%3Dwww.example.com%3Bpath%3D%2Fapi#Obfs`,
  // IPv6
  `ss://${b64("aes-256-gcm:pass")}@[2001:db8::1]:8388#IPv6`,
];

describe("shadowsocks SIP002 parse + zod validation", () => {
  for (const link of sip002Links) {
    const label = link.slice(0, 60);
    it(`validates: ${label}...`, () => {
      const ob = parseShadowsocks(link);
      if (!ob) throw new Error("parse returned null");
      const config = { outbounds: [ob] };
      const res = xraySchema.safeParse(config);
      expect(res.success, res.success ? "" : JSON.stringify(res.error.issues, null, 2)).toBe(true);
    });
  }
});

/* ------------------------------------------------------------------ *
 * Legacy format
 * ------------------------------------------------------------------ */

const legacyLinks = [
  // Basic legacy
  `ss://${b64("aes-256-gcm:password123@example.com:8388")}#LegacyBasic`,
  // Legacy with chacha20
  `ss://${b64("chacha20-ietf-poly1305:pass@1.2.3.4:8388")}#LegacyChaCha`,
  // Legacy with none method (no longer valid)
  // `ss://${b64("none:@example.com:8080")}#LegacyNone`,
];

describe("shadowsocks legacy parse + zod validation", () => {
  for (const link of legacyLinks) {
    const label = link.slice(0, 60);
    it(`validates: ${label}...`, () => {
      const ob = parseShadowsocks(link);
      if (!ob) throw new Error("parse returned null");
      const config = { outbounds: [ob] };
      const res = xraySchema.safeParse(config);
      expect(res.success, res.success ? "" : JSON.stringify(res.error.issues, null, 2)).toBe(true);
    });
  }
});

/* ------------------------------------------------------------------ *
 * Field extraction
 * ------------------------------------------------------------------ */

describe("shadowsocks field extraction", () => {
  it("SIP002: extracts method and password from base64 userinfo", () => {
    const ob: any = parseShadowsocks(`ss://${b64("aes-256-gcm:secretPass")}@example.com:8388#Test`);
    expect(ob.settings.method).toBe("aes-256-gcm");
    expect(ob.settings.password).toBe("secretPass");
    expect(ob.settings.address).toBe("example.com");
    expect(ob.settings.port).toBe(8388);
  });

  it("SIP002: extracts method and password from plain userinfo", () => {
    const ob: any = parseShadowsocks("ss://chacha20-poly1305:pass@1.2.3.4:8388#Test");
    expect(ob.settings.method).toBe("chacha20-poly1305");
    expect(ob.settings.password).toBe("pass");
  });

  it("legacy: extracts method (lowercased) and password", () => {
    const ob: any = parseShadowsocks(`ss://${b64("AES-256-GCM:pass@example.com:8388")}#Test`);
    expect(ob.settings.method).toBe("aes-256-gcm");
    expect(ob.settings.password).toBe("pass");
  });

  it("SIP002: extracts remarks from fragment", () => {
    const ob: any = parseShadowsocks(`ss://${b64("aes-256-gcm:pass")}@example.com:8388#MyServer`);
    expect(ob.tag).toBe("MyServer");
  });

  it("legacy: extracts remarks from fragment", () => {
    const ob: any = parseShadowsocks(`ss://${b64("aes-256-gcm:pass@example.com:8388")}#LegacyServer`);
    expect(ob.tag).toBe("LegacyServer");
  });
});

/* ------------------------------------------------------------------ *
 * Plugin obfs support
 * ------------------------------------------------------------------ */

describe("shadowsocks plugin obfs", () => {
  it("maps obfs=http to tcp http header transport", () => {
    const ob: any = parseShadowsocks(
      `ss://${b64("aes-256-gcm:pass")}@example.com:443?plugin=obfs-local%3Bobfs%3Dhttp%3Bobfs-host%3Dwww.example.com%3Bpath%3D%2Fapi#Obfs`,
    );
    expect(ob.streamSettings?.method).toBe("tcp");
    expect(ob.streamSettings?.tcpSettings?.header?.type).toBe("http");
    expect(ob.streamSettings?.tcpSettings?.header?.request?.headers?.Host).toEqual(["www.example.com"]);
    expect(ob.streamSettings?.tcpSettings?.header?.request?.path).toEqual(["/api"]);
  });
});

/* ------------------------------------------------------------------ *
 * Round-trip
 * ------------------------------------------------------------------ */

describe("shadowsocks round-trip", () => {
  it("generateShadowsocks(parseShadowsocks(x)) produces equivalent outbound", () => {
    const link = `ss://${b64("aes-256-gcm:password123")}@example.com:8388#Basic`;
    const ob: any = parseShadowsocks(link);
    if (!ob) throw new Error("parse returned null");
    const regen = generateShadowsocks(ob);
    const ob2: any = parseShadowsocks(regen);
    if (!ob2) throw new Error("regen parse returned null");

    expect(ob2.settings.method).toBe(ob.settings.method);
    expect(ob2.settings.password).toBe(ob.settings.password);
    expect(ob2.settings.address).toBe(ob.settings.address);
    expect(ob2.settings.port).toBe(ob.settings.port);
    expect(ob2.tag).toBe(ob.tag);
  });
});

/* ------------------------------------------------------------------ *
 * Error cases
 * ------------------------------------------------------------------ */

describe("shadowsocks errors", () => {
  it("returns null for missing port in SIP002", () => {
    expect(parseShadowsocks(`ss://${b64("aes-256-gcm:pass")}@example.com#NoPort`)).toBeNull();
  });
});

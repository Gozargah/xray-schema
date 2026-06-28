import { describe, it, expect } from "vitest";
import { parseSocks, generateSocks } from "../../src/link/socks.ts";
import { xraySchema } from "../../src/schema.ts";

const b64 = (s: string) => btoa(s);

const links = [
  // Basic with base64 auth
  `socks://${b64("user:pass")}@example.com:1080#Basic`,
  // Plain userinfo
  "socks://user:pass@1.2.3.4:1080#Plain",
  // No auth
  "socks://example.com:1080#NoAuth",
  // IPv6
  `socks://${b64("user:pass")}@[2001:db8::1]:1080#IPv6`,
  // Empty password
  `socks://${b64("user:")}@example.com:1080#EmptyPass`,
];

describe("socks parse + zod validation", () => {
  for (const link of links) {
    const label = link.slice(0, 60);
    it(`validates: ${label}...`, () => {
      const ob = parseSocks(link);
      const config = { outbounds: [ob] };
      const res = xraySchema.safeParse(config);
      expect(res.success, res.success ? "" : JSON.stringify(res.error.issues, null, 2)).toBe(true);
    });
  }
});

describe("socks field extraction", () => {
  it("extracts user and pass from base64 userinfo", () => {
    const ob: any = parseSocks(`socks://${b64("myuser:mypass")}@example.com:1080#Test`);
    expect(ob.settings.user).toBe("myuser");
    expect(ob.settings.pass).toBe("mypass");
    expect(ob.settings.address).toBe("example.com");
    expect(ob.settings.port).toBe(1080);
  });

  it("extracts user and pass from plain userinfo", () => {
    const ob: any = parseSocks("socks://user:pass@1.2.3.4:1080#Test");
    expect(ob.settings.user).toBe("user");
    expect(ob.settings.pass).toBe("pass");
  });

  it("handles no auth (empty userinfo)", () => {
    const ob: any = parseSocks("socks://example.com:1080#NoAuth");
    expect(ob.settings.address).toBe("example.com");
    expect(ob.settings.port).toBe(1080);
    expect(ob.settings.user).toBeUndefined();
    expect(ob.settings.pass).toBeUndefined();
  });

  it("extracts remarks from fragment", () => {
    const ob: any = parseSocks(`socks://${b64("user:pass")}@example.com:1080#MyServer`);
    expect(ob.tag).toBe("MyServer");
  });
});

describe("socks round-trip", () => {
  it("generateSocks(parseSocks(x)) produces equivalent outbound", () => {
    const link = `socks://${b64("user:pass")}@example.com:1080#Basic`;
    const ob: any = parseSocks(link);
    const regen = generateSocks(ob);
    const ob2: any = parseSocks(regen);

    expect(ob2.settings.user).toBe(ob.settings.user);
    expect(ob2.settings.pass).toBe(ob.settings.pass);
    expect(ob2.settings.address).toBe(ob.settings.address);
    expect(ob2.settings.port).toBe(ob.settings.port);
    expect(ob2.tag).toBe(ob.tag);
  });
});

describe("socks errors", () => {
  it("throws on missing address", () => {
    expect(() => parseSocks("socks://user:pass@:1080")).toThrow();
  });

  it("throws on missing port", () => {
    expect(() => parseSocks("socks://user:pass@example.com")).toThrow("server port");
  });
});

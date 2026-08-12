import { describe, it, expect } from "vitest";
import { parseHysteria2, generateHysteria2 } from "../../src/link/hysteria2.ts";
import { xraySchema } from "../../src/schema.ts";

const links = [
  // Basic hysteria2
  "hysteria2://mypassword@example.com:443?sni=example.com#Basic",
  // With obfs
  "hysteria2://pass@example.com:443?sni=example.com&obfs-password=obfsSecret#Obfs",
  // With port hopping
  "hysteria2://pass@example.com:443?sni=example.com&mport=2000-5000&mportHopInt=30#Hop",
  // With pinSHA256
  "hysteria2://pass@example.com:443?sni=example.com&pinSHA256=abcdef123456#Pin",
  // With insecure
  "hysteria2://pass@example.com:443?sni=example.com&insecure=1#Insecure",
  // With fingerprint
  "hysteria2://pass@example.com:443?sni=example.com&fp=chrome#FP",
  // hy2:// alias
  "hy2://pass@example.com:443?sni=example.com#Alias",
  // Full link with obfs + port hopping
  "hysteria2://pass@example.com:443?sni=example.com&obfs-password=secret&mport=3000-4000&mportHopInt=15#Full",
];

describe("hysteria2 parse + zod validation", () => {
  for (const link of links) {
    const label = link.slice(0, 60);
    it(`validates: ${label}...`, () => {
      const ob = parseHysteria2(link);
      const config = { outbounds: [ob] };
      const res = xraySchema.safeParse(config);
      expect(res.success, res.success ? "" : JSON.stringify(res.error.issues, null, 2)).toBe(true);
    });
  }
});

describe("hysteria2 field extraction", () => {
  it("sets auth password in streamSettings.hysteriaSettings.auth", () => {
    const ob: any = parseHysteria2("hysteria2://mypassword@example.com:443?sni=example.com#Test");
    expect(ob.settings.address).toBe("example.com");
    expect(ob.settings.port).toBe(443);
    expect(ob.settings.version).toBe(2);
    expect(ob.streamSettings.hysteriaSettings.auth).toBe("mypassword");
  });

  it("forces network=hysteria, security=tls, alpn=h3", () => {
    const ob: any = parseHysteria2("hysteria2://pass@example.com:443#Test");
    expect(ob.streamSettings.network).toBe("hysteria");
    expect(ob.streamSettings.security).toBe("tls");
    // alpn is set as forced query param, handled by buildStreamSettings
  });

  it("maps obfs-password to finalmask.udp salamander", () => {
    const ob: any = parseHysteria2(
      "hysteria2://pass@example.com:443?sni=example.com&obfs-password=mySecret#Test",
    );
    const salamander = ob.streamSettings.finalmask?.udp?.find(
      (e: any) => e?.type === "salamander",
    );
    expect(salamander).toBeDefined();
    expect(salamander.settings.password).toBe("mySecret");
  });

  it("maps mport/mportHopInt to finalmask.quicParams.udpHop", () => {
    const ob: any = parseHysteria2(
      "hysteria2://pass@example.com:443?sni=example.com&mport=2000-5000&mportHopInt=30#Hop",
    );
    expect(ob.streamSettings.finalmask?.quicParams?.udpHop?.ports).toBe("2000-5000");
    expect(ob.streamSettings.finalmask?.quicParams?.udpHop?.interval).toBe("30");
  });

  it("maps pinSHA256 to tlsSettings.pinnedPeerCertSha256", () => {
    const ob: any = parseHysteria2(
      "hysteria2://pass@example.com:443?sni=example.com&pinSHA256=abc123#Pin",
    );
    expect(ob.streamSettings.tlsSettings?.pinnedPeerCertSha256).toBe("abc123");
  });

  it("maps insecure to tlsSettings.allowInsecure", () => {
    const ob: any = parseHysteria2(
      "hysteria2://pass@example.com:443?sni=example.com&insecure=1#Insecure",
    );
    expect(ob.streamSettings.tlsSettings?.allowInsecure).toBe(true);
  });

  it("handles hy2:// alias", () => {
    const ob: any = parseHysteria2("hy2://pass@example.com:443?sni=example.com#Alias");
    expect(ob.settings.address).toBe("example.com");
    expect(ob.streamSettings.hysteriaSettings.auth).toBe("pass");
  });

  it("extracts remarks from fragment", () => {
    const ob: any = parseHysteria2("hysteria2://pass@example.com:443#MyServer");
    expect(ob.tag).toBe("MyServer");
  });

  it("clamps port hop interval < 5 to default 30", () => {
    const ob: any = parseHysteria2(
      "hysteria2://pass@example.com:443?sni=example.com&mport=1000-2000&mportHopInt=3#Hop",
    );
    const interval = ob.streamSettings.finalmask?.quicParams?.udpHop?.interval;
    // Single int < 5 defaults to 30 (v2rayNG behavior)
    expect(interval).toBe(30);
  });
});

describe("hysteria2 round-trip", () => {
  it("generateHysteria2(parseHysteria2(x)) produces equivalent outbound", () => {
    const link = "hysteria2://mypassword@example.com:443?sni=example.com#Basic";
    const ob: any = parseHysteria2(link);
    const regen = generateHysteria2(ob);
    const ob2: any = parseHysteria2(regen);

    expect(ob2.settings.address).toBe(ob.settings.address);
    expect(ob2.settings.port).toBe(ob.settings.port);
    expect(ob2.streamSettings?.hysteriaSettings?.auth).toBe(
      ob.streamSettings?.hysteriaSettings?.auth,
    );
    expect(ob2.tag).toBe(ob.tag);
  });
});

describe("hysteria2 errors", () => {
  it("throws on missing password", () => {
    expect(() => parseHysteria2("hysteria2://@example.com:443")).toThrow("password");
  });

  it("throws on missing address", () => {
    expect(() => parseHysteria2("hysteria2://pass@:443")).toThrow();
  });
});

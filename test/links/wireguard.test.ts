import { describe, it, expect } from "vitest";
import { parseWireguard, generateWireguard } from "../../src/link/wireguard.ts";
import { xraySchema } from "../../src/schema.ts";

const links = [
  // Full link
  "wireguard://cHJpdmF0ZUtleQ==@example.com:51820?publickey=base64PublicKey&address=10.0.0.2%2F32&mtu=1420&reserved=0,0,0#WG",
  // Minimal (just required fields)
  "wireguard://mySecretKey@1.2.3.4:51820?publickey=pk#Minimal",
  // With preSharedKey
  "wireguard://sk@example.com:51820?publickey=pk&presharedkey=psk&address=10.0.0.1%2F24#PSK",
  // IPv6 endpoint
  "wireguard://sk@[2001:db8::1]:51820?publickey=pk&address=fd00::1%2F64#IPv6",
  // Custom mtu and reserved
  "wireguard://sk@example.com:51820?publickey=pk&mtu=1280&reserved=128,64,32#Custom",
  // Multi-address
  "wireguard://sk@example.com:51820?publickey=pk&address=10.0.0.1%2F32,10.0.0.2%2F32#MultiAddr",
];

describe("wireguard parse + zod validation", () => {
  for (const link of links) {
    const label = link.slice(0, 70);
    it(`validates: ${label}...`, () => {
      const ob = parseWireguard(link);
      const config = { outbounds: [ob] };
      const res = xraySchema.safeParse(config);
      expect(res.success, res.success ? "" : JSON.stringify(res.error.issues, null, 2)).toBe(true);
    });
  }
});

describe("wireguard field extraction", () => {
  it("extracts secretKey, publicKey, endpoint, address, mtu, reserved", () => {
    const ob: any = parseWireguard(
      "wireguard://mySecretKey@1.2.3.4:51820?publickey=pk&address=10.0.0.1%2F32&mtu=1420&reserved=0,0,0#WG",
    );
    expect(ob.settings.secretKey).toBe("mySecretKey");
    expect(ob.settings.peers[0].endpoint).toBe("1.2.3.4:51820");
    expect(ob.settings.peers[0].publicKey).toBe("pk");
    expect(ob.settings.address).toEqual(["10.0.0.1/32"]);
    expect(ob.settings.mtu).toBe(1420);
    expect(ob.settings.reserved).toEqual([0, 0, 0]);
  });

  it("extracts preSharedKey when present", () => {
    const ob: any = parseWireguard(
      "wireguard://sk@example.com:51820?publickey=pk&presharedkey=psk#PSK",
    );
    expect(ob.settings.peers[0].preSharedKey).toBe("psk");
  });

  it("defaults address to 172.16.0.2/32 when absent", () => {
    const ob: any = parseWireguard("wireguard://sk@example.com:51820?publickey=pk#Default");
    expect(ob.settings.address).toEqual(["172.16.0.2/32"]);
  });

  it("defaults mtu to 1420 when absent", () => {
    const ob: any = parseWireguard("wireguard://sk@example.com:51820?publickey=pk#Default");
    expect(ob.settings.mtu).toBe(1420);
  });

  it("defaults reserved to [0,0,0] when absent", () => {
    const ob: any = parseWireguard("wireguard://sk@example.com:51820?publickey=pk#Default");
    expect(ob.settings.reserved).toEqual([0, 0, 0]);
  });

  it("parses multiple addresses from comma-separated value", () => {
    const ob: any = parseWireguard(
      "wireguard://sk@example.com:51820?publickey=pk&address=10.0.0.1%2F32,10.0.0.2%2F32#Multi",
    );
    expect(ob.settings.address).toEqual(["10.0.0.1/32", "10.0.0.2/32"]);
  });

  it("handles IPv6 endpoint", () => {
    const ob: any = parseWireguard(
      "wireguard://sk@[2001:db8::1]:51820?publickey=pk&address=fd00::1%2F64#IPv6",
    );
    // hostname strips brackets; endpoint becomes bare IPv6:port
    expect(ob.settings.peers[0].endpoint).toBe("2001:db8::1:51820");
  });

  it("extracts remarks from fragment", () => {
    const ob: any = parseWireguard("wireguard://sk@example.com:51820?publickey=pk#MyServer");
    expect(ob.tag).toBe("MyServer");
  });
});

describe("wireguard round-trip", () => {
  it("generateWireguard(parseWireguard(x)) produces equivalent outbound", () => {
    const link = "wireguard://cHJpdmF0ZUtleQ==@example.com:51820?publickey=base64PublicKey&address=10.0.0.2%2F32&mtu=1420&reserved=0,0,0#WG";
    const ob: any = parseWireguard(link);
    const regen = generateWireguard(ob);
    const ob2: any = parseWireguard(regen);

    expect(ob2.settings.secretKey).toBe(ob.settings.secretKey);
    expect(ob2.settings.peers[0].publicKey).toBe(ob.settings.peers[0].publicKey);
    expect(ob2.settings.address).toEqual(ob.settings.address);
    expect(ob2.settings.mtu).toBe(ob.settings.mtu);
    expect(ob2.settings.reserved).toEqual(ob.settings.reserved);
    expect(ob2.tag).toBe(ob.tag);
  });
});

describe("wireguard errors", () => {
  it("throws on missing secretKey", () => {
    expect(() => parseWireguard("wireguard://@example.com:51820?publickey=pk")).toThrow("secretKey");
  });

  it("throws on missing publickey", () => {
    expect(() => parseWireguard("wireguard://sk@example.com:51820")).toThrow("publickey");
  });

  it("throws on missing port", () => {
    expect(() => parseWireguard("wireguard://sk@example.com?publickey=pk")).toThrow("server port");
  });
});

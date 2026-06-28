import { describe, it, expect } from "vitest";
import { parseVless } from "../../src/link/vless.ts";
import { xraySchema } from "../../src/schema.ts";

const links = [
  "vless://0d3f1a2b-8c4e-4fa3-9d51-7b2e9f1a3c5d@example.com:443?type=xhttp&security=reality&sni=www.google.com&fp=chrome&pbk=ABCdef123&sid=0a1b2c&spx=%2Fpath&encryption=none#MyServer",
  "vless://uuid-1234@1.2.3.4:8443?type=ws&security=tls&sni=cdn.example.com&host=cdn.example.com&path=%2Fws&flow=xtls-rprx-vision#WS-Server",
  "vless://simple-id@10.0.0.1:8080#Plain",
  "vless://grpc-uuid@grpc.example.com:443?type=grpc&security=tls&sni=grpc.example.com&serviceName=grpcService&authority=grpc.example.com&mode=multi#gRPC",
  "vless://kcp-uuid@1.2.3.4:18390?type=kcp&seed=mySecretSeed&headerType=none#KCP",
  "vless://tcp-http-uuid@1.2.3.4:80?type=tcp&headerType=http&host=www.example.com&path=%2Fapi#TCP-HTTP",
  "vless://hu-uuid@1.2.3.4:443?type=httpupgrade&security=tls&sni=hu.example.com&host=hu.example.com&path=%2Fhu#HU",
  "vless://uuid-1111@speedtest.net:443?encryption=none&type=xhttp&mode=auto&host=example.com&path=/&security=tls&fp=chrome&sni=example.com&alpn=h2#DE",
  "vless://uuid-2222@speedtest.net:443?encryption=none&type=ws&path=/ws?ed%3D360&security=tls&fp=chrome&sni=example.com&pcs=330df15fc054f2b4d9e1e744ed93a67c163ca1e8fa625a0691d798d1d3f87059#DE"
];

describe("vless zod validation", () => {
  for (const link of links) {
    const label = link.slice(0, 50);
    it(`validates: ${label}...`, () => {
      const ob = parseVless(link);
      const config = { outbounds: [ob] };
      const res = xraySchema.safeParse(config);
      expect(res.success, res.success ? "" : JSON.stringify(res.error.issues, null, 2)).toBe(true);
    });
  }
});

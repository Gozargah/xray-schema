import z from "zod";
import { rawStream, tcpStream } from "./raw/raw.ts";
import { mkcpStream } from "./mkcp/mkcp.ts";
import { websocketStream } from "./websocket/websocket.ts";
import { grpcStream } from "./grpc/grpc.ts";
import { hysteriaStream } from "./hysteria/hysteria.ts";
import { httpUpgradeStream } from "./httpupgrade/httpupgrade.ts";
import { splithttpStream, xhttpStream } from "./xhttp/xhttp.ts";
import { reality } from "./security/reality/reality.ts";
import { tls } from "./security/tls/tls.ts";
import securityDescription from "./securityField.md?raw";
import transportDescription from "./transport.md?raw";

const noSecurity = z.object({
  security: z.literal("none").optional().meta({
    markdownDescription: securityDescription,
  }),
});

const mergeStreamWithOtherFields = <T extends z.ZodRawShape>(schema: z.ZodObject<T>) => {
  return [
    z.object({ ...schema.shape, ...reality.shape }),
    z.object({ ...schema.shape, ...tls.shape }),
    z.object({ ...schema.shape, ...noSecurity.shape }),
  ] as const;
};

const _streamSettings = z
  .union([
    ...mergeStreamWithOtherFields(tcpStream),
    ...mergeStreamWithOtherFields(rawStream),
    ...mergeStreamWithOtherFields(mkcpStream),
    ...mergeStreamWithOtherFields(websocketStream),
    ...mergeStreamWithOtherFields(grpcStream),
    ...mergeStreamWithOtherFields(hysteriaStream),
    ...mergeStreamWithOtherFields(httpUpgradeStream),
    ...mergeStreamWithOtherFields(xhttpStream),
    ...mergeStreamWithOtherFields(splithttpStream),
  ])
  .meta({
    ifThenLogic: true,
    discriminator: "network",
    secondaryDiscriminator: "security",
    markdownDescription: transportDescription,
  });

export type StreamSettings = any;
export const streamSettings: z.ZodType<StreamSettings> = _streamSettings as any;

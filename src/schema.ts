import z from "zod";
import { versionSchema } from "./schema/transport/version/version.ts";
import { logSchema } from "./schema/log/log.ts";
import { apiSchema } from "./schema/api/api.ts";
import { dnsSchema } from "./schema/dns/dns.ts";
import { routingSchema } from "./schema/routing/routing.ts";
import { envSchema } from "./schema/env/env.ts";
import { policySchema } from "./schema/policy/policy.ts";
import { inbound } from "./schema/inbounds/inbounds.ts";
import { stats } from "./schema/stats/stats.ts";
import { metrics } from "./schema/metrics/metrics.ts";
import { observatory } from "./schema/observatory/observatory.ts";
import { burstObservatory } from "./schema/burstObservatory/burstObservatory.ts";
import { reverse } from "./schema/reverse/reverse.ts";
import { outbound } from "./schema/outbounds/outbounds.ts";

import { fakedns } from "./schema/fakedns/fakedns.ts";

export const xraySchema = z
  .object({
    env: envSchema.optional(),
    version: versionSchema.optional(),
    log: logSchema.optional(),
    api: apiSchema.optional(),
    dns: dnsSchema.optional(),
    routing: routingSchema.optional(),
    fakedns: fakedns.optional(),
    policy: policySchema.optional(),
    stats: stats.optional(),
    metrics: metrics.optional(),
    observatory: observatory.optional(),
    burstObservatory: burstObservatory.optional(),
    reverse: reverse.optional(),
    inbounds: z.array(inbound).optional(),
    outbounds: z.array(outbound).optional(),
  })
  .loose();

export type XrayConfig = z.infer<typeof xraySchema>;
export type XrayInbound = z.infer<typeof inbound>;

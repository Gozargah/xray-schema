import z from "zod";
import { versionSchema } from "./transport/version/version.ts";
import { logSchema } from "./log/log.ts";
import { apiSchema } from "./api/api.ts";
import { dnsSchema } from "./dns/dns.ts";
import { routingSchema } from "./routing/routing.ts";
import { policySchema } from "./policy/policy.ts";
import { inbound } from "./inbounds/inbounds.ts";
import { stats } from "./stats/stats.ts";
import { metrics } from "./metrics/metrics.ts";
import { observatory } from "./observatory/observatory.ts";
import { burstObservatory } from "./burstObservatory/burstObservatory.ts";
import { reverse } from "./reverse/reverse.ts";
import { outbound } from "./outbounds/outbounds.ts";

import { fakedns } from "./fakedns/fakedns.ts";

export const xraySchema = z
  .object({
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

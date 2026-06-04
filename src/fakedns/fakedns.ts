import z from "zod";

const fakednsObject = z.object({
  ipPool: z.string().meta({
    markdownDescription: `CIDR, FakeDNS will allocate addresses using the IP block specified in this option.`,
  }),
  poolSize: z
    .int()
    .meta({
      markdownDescription: `Specifies the maximum number of Domain-IP mappings stored by FakeDNS. When the number of mappings exceeds this value, mappings will be evicted according to LRU rules. Default is \`65535\`.

### Warning
\`poolSize\` must be less than or equal to the total number of addresses in the \`ipPool\`.`,
    })
    .default(65535)
    .optional(),
});

export const fakedns = fakednsObject.or(z.array(fakednsObject)).meta({
  markdownDescription: `FakeDNS obtains target domain names by forging DNS responses. It can reduce latency during DNS queries and assist transparent proxies in acquiring target domain names.

### Warning
FakeDNS may pollute the local DNS cache, causing "no network access" after Xray is closed.


[Documentation ↗](https://xtls.github.io/en/config/fakedns.html)
`,
});

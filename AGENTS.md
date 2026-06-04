## Scope

These instructions apply to the **library** project only (root package) and its schema/docs under `src/**`.

Do **not** apply these rules to the example or playground projects under `example/` and `playground/`.

## Library Documentation Rules

### Source of Truth (1:1 with official docs)

- Content in markdown fragments must match the official Project X documentation **1:1 in meaning and ordering**.
- Keep all defaults, ranges, warnings, tips, and limitations that appear in the official doc.
- Only adapt for Monaco rendering (plain markdown). Do not invent or omit content.
- Strip VuePress-only UI or navigation elements; preserve the core documentation text and examples.

### Links (Monaco-safe)

- All links must be absolute and start with `https://xtls.github.io`.
- Replace relative links from the official docs with absolute equivalents.

### Documentation Footer

When an object has a dedicated official documentation page, append this at the **end** of the markdown:

```
[Documentation ↗](https://xtls.github.io/en/config/....html)
```

Examples: protocol inbounds/outbounds, transport methods, or any object with its own page.

### Headings & Blocks

- Preserve section headings like `### DANGER`, `### WARNING`, `### TIP`, `### NOTE` as plain markdown.
- Do not include JSON examples in markdown fragments.

### Placement & Imports

- Store markdown fragments next to their schema under `src/**`.
- Use one file per field (for `markdownDescription`) plus object-level docs (for parent object/schema).
- Import with `?raw` and attach to `markdownDescription` on the corresponding Zod node.

### Prompt Pattern (Protocol Docs)

Use this request format when asking for a protocol doc integration:

```
Integrate the Xray <protocol> inbound/outbound docs into <path>. Follow library documentation rules: one .md per field, no JSON examples, absolute links only, add documentation footer, and attach each file via markdownDescription with ?raw imports.
```

## Library Status

- `src/schema.ts` is the main config schema entrypoint with protocol-aware inbound validation.
- `src/index.ts` exposes the public API:
  - `validateXrayConfig`
  - `validateInbound`
  - `linkToInboundJson`
  - `inboundJsonToLink`
- Link handling supports two modes:
  - `strict-doc`: documented-safe behavior only, with `Documentation does not mention` for unsupported cases.
  - `best-effort`: pragmatic compatibility for common VMess/SS style links.
- Tests in `test/index.test.ts` cover validation and conversion behavior.
- Transport documentation uses raw-imported markdown fragments under `src/**`.
- Verification status: `pnpm test` passes.

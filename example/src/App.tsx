import { AppBar } from "./AppBar";
import { Footer } from "./Footer";
import { Button } from "@/components/ui/button";
import { BatteryCharging, Braces, Check, Copy, Sparkles, Wand2 } from "lucide-react";
import { useMemo, useState } from "react";
import ShikiHighlighter from "react-shiki";

function App() {
  const [copied, setCopied] = useState(false);
  const [pkg, setPkg] = useState<"npm" | "pnpm" | "yarn">("pnpm");

  const installLine = useMemo(() => {
    if (pkg === "pnpm") return "pnpm add @gozargah/xray-schema";
    if (pkg === "yarn") return "yarn add @gozargah/xray-schema";
    return "npm i @gozargah/xray-schema";
  }, [pkg]);

  return (
    <div className="flex min-h-screen flex-col">
      <AppBar />

      <main className="flex-1">
        <section className="relative overflow-hidden border-b border-border/60">
          <div className="absolute inset-0 -z-10 bg-linear-to-b from-background via-background to-background" />

          <div className="mx-auto max-w-6xl px-6 py-12">
            <div className="">
              <h2 className="text-balance text-2xl font-semibold tracking-tight leading-relaxed sm:text-3xl text-blue-50">
                TypeScript-first
                <a href="https://zed.dev" className="text-[#408AFF] underline underline-offset-8">
                  <img
                    src="https://github.com/colinhacks/zod/raw/main/logo.svg"
                    className="inline-block h-10 w-10 align-middle mx-2"
                  />
                  <span className="mr-2">Zod</span>
                </a>
                schemas for
                <a
                  href="https://github.com/xtls/xray-core"
                  className="mx-2 underline underline-offset-8"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                    version="1.1"
                    viewBox="0 0 1000 1000"
                    className="h-10 w-10 inline-block fill-white mr-2"
                    xmlSpace="preserve"
                  >
                    <script xmlns="" />
                    <polygon points="530,530 900,530 650,650 530,1000 " />
                    <polygon points="470,530 470,900 350,650 0,530 " />
                    <polygon points="530,470 530,100 650,350 1000,470 " />
                    <polygon points="470,470 100,470 350,350 470,0 " />
                  </svg>
                  Xray
                </a>
                config JSON
              </h2>

              <p className="mt-3 text-pretty text-sm text-muted-foreground sm:text-base max-w-3xl">
                Validate configs before they touch the core. Get exact error paths. Generate JSON
                Schema for Monaco autocomplete.
              </p>

              <div className="mt-6 flex flex-col gap-3">
                <div className="max-w-md flex w-full items-center justify-between gap-3 rounded-lg border border-border bg-card px-4 py-3 font-mono text-sm">
                  <span className="text-muted-foreground">$</span>
                  <span className="flex-1 text-foreground">npm i @gozargah/xray-schema</span>
                  <Button
                    size="icon-sm"
                    variant="ghost"
                    aria-label="Copy install command"
                    onClick={async () => {
                      await navigator.clipboard.writeText("npm i @gozargah/xray-schema");
                      setCopied(true);
                      window.setTimeout(() => setCopied(false), 1200);
                    }}
                  >
                    {copied ? <Check /> : <Copy />}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-12">
          <div className="mb-6 flex items-end justify-between gap-6">
            <div>
              <h3 className="text-lg font-semibold tracking-tight">Interactive Monaco demo</h3>
              <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                This editor is powered by xray-schema → JSON Schema → Monaco
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-14 pb-8">
          <h3 className="text-sm font-semibold text-foreground">The Idea</h3>
          <p className="mt-3 text-pretty text-muted-foreground">
            Xray is configured by a JSON blob with no official TypeScript types and minimal
            documentation. Most panels and clients either copy configs blindly or ship fragile
            manual validators. xray-schema is the missing schema layer — runtime validation +
            compile-time inference from a single source of truth.
          </p>
        </section>

        <section className="mx-auto max-w-6xl px-6 pb-14">
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl border border-border bg-card p-5">
              <div className="mb-2 flex items-center gap-2 text-sm font-semibold">
                <Braces className="text-violet-400" /> TypeScript inference
              </div>
              <div className="mb-3 font-mono text-xs text-muted-foreground leading-relaxed">
                <span className="text-foreground">z.infer</span> gives a typed config tree — no
                drift
              </div>
              <ShikiHighlighter
                language="jsx"
                theme="github-dark"
                addDefaultStyles={false}
                rootStyle={{ padding: "12px" }}
                showLanguage={false}
                className="overflow-x-auto rounded-lg border border-border bg-background/40 font-mono text-xs text-muted-foreground"
              >
                {`import z from "zod";
import type { XraySchema } from "@gozargah/xray-schema";

const config: XraySchema = {
  log: { loglevel: "error" },
  inbounds: [{
    ...
  }]
}`}
              </ShikiHighlighter>
            </div>

            <div className="rounded-xl border border-border bg-card p-5 flex flex-col">
              <div className="mb-2 flex items-center gap-2 text-sm font-semibold">
                <Sparkles className="text-cyan-400" /> Schema validation
              </div>
              <div className="mb-3 font-mono text-xs text-muted-foreground leading-relaxed">
                throws a <span className="text-foreground">ZodError</span> with a precise path like{" "}
                <span className="text-destructive">inbounds[0].port</span>
              </div>
              <ShikiHighlighter
                language="jsx"
                theme="github-dark"
                addDefaultStyles={false}
                rootStyle={{ padding: "12px" }}
                showLanguage={false}
                className="overflow-x-auto rounded-lg border border-border bg-background/40 font-mono text-xs text-muted-foreground"
              >
                {`import { xraySchema } from "@gozargah/xray-schema";

xraySchema.parse({
  inbounds: [{
    protocol: "vless",
    port: 0,
    settings: { decryption: "none" },
  }],
});`}
              </ShikiHighlighter>
            </div>

            <div className="rounded-xl border border-border bg-card p-5 flex flex-col">
              <div className="mb-2 flex items-center gap-2 text-sm font-semibold">
                <Wand2 className="text-cyan-400" /> Monaco editor integration
              </div>
              <div className="mb-3 font-mono text-xs text-muted-foreground leading-relaxed">
                <span className="text-foreground">toJSONSchema()</span> → Monaco JSON diagnostics
              </div>

              <ShikiHighlighter
                language="jsx"
                theme="github-dark"
                addDefaultStyles={false}
                rootStyle={{ padding: "12px" }}
                showLanguage={false}
                className="grow overflow-x-auto rounded-lg border border-border bg-background/40 font-mono text-xs text-muted-foreground"
              >
                {`import { xraySchema } from "@gozargah/xray-schema/with-description";

// in integrate it with monaco editor
monaco.languages.json.jsonDefaults
  .setDiagnosticsOptions({
    validate: true,
    schemas: [{ schema: xraySchema.toJSONSchema() }],
});`}
              </ShikiHighlighter>
            </div>

            <div className="rounded-xl border border-border bg-card p-5">
              <div className="mb-2 flex items-center gap-2 text-sm font-semibold">
                <BatteryCharging className="text-green-400" /> Default Snippets
              </div>
              <div className="mb-3 font-mono text-xs text-muted-foreground leading-relaxed">
                Speed up writing configs by using the snippets which integrates with Monaco's
                completion item details.
              </div>

              <ShikiHighlighter
                language="jsx"
                theme="github-dark"
                addDefaultStyles={false}
                rootStyle={{ padding: "12px" }}
                showLanguage={false}
                className="grow overflow-x-auto rounded-lg border border-border bg-background/40 font-mono text-xs text-muted-foreground"
              >
                {`import { xraySchema } from "@gozargah/xray-schema/with-snippets";

// after integration, default snippets will be available in the editor's autocomplete
monaco.languages.json.jsonDefaults
  .setDiagnosticsOptions({
    validate: true,
    schemas: [{ schema: xraySchema.toJSONSchema() }],
});`}
              </ShikiHighlighter>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 pb-16">
          <h3 className="text-lg font-semibold tracking-tight">Variants</h3>
          <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
            Pick the surface you want: minimal runtime validation, or full editor-grade metadata.
          </p>

          <div className="mt-4 grid grid-cols-3 gap-3">
            <div className="rounded-xl border border-border bg-card p-5">
              <div className="font-mono text-sm text-foreground">@gozargah/xray-schema</div>
              <div className="mt-2 text-sm text-muted-foreground">
                Lite version of Zod validation + TypeScript inference. No markdown descriptions.
              </div>
            </div>
            <div className="rounded-xl border border-border bg-card p-5">
              <div className="font-mono text-sm text-foreground">
                <span className="opacity-55">@gozargah/xray-schema/</span>
                <span>with-description</span>
              </div>
              <div className="mt-2 text-sm text-muted-foreground">
                Zod validation + markdown descriptions for JSON Schema / Monaco tooltips.
              </div>
            </div>
            <div className="rounded-xl border border-border bg-card p-5">
              <div className="font-mono text-sm text-foreground">
                <span className="opacity-55">@gozargah/xray-schema/</span>
                <span>with-snippets</span>
              </div>
              <div className="mt-2 text-sm text-muted-foreground">
                Validation + descriptions + snippets (template-ready defaults for editor tooling).
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 pb-16">
          <h3 className="text-lg font-semibold tracking-tight">Quick start</h3>
          <div className="mt-4 rounded-xl border border-border bg-card p-5">
            <div className="flex flex-wrap gap-2">
              {(["pnpm", "npm", "yarn"] as const).map((k) => (
                <Button
                  key={k}
                  variant={pkg === k ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setPkg(k)}
                >
                  {k}
                </Button>
              ))}
            </div>

            <div className="mt-4 flex items-center justify-between gap-3 rounded-lg border border-border bg-background/40 px-4 py-3 font-mono text-sm">
              <span className="text-muted-foreground">$</span>
              <span className="flex-1 text-foreground">{installLine}</span>
              <Button
                size="icon-sm"
                variant="ghost"
                aria-label="Copy install command"
                onClick={async () => {
                  await navigator.clipboard.writeText(installLine);
                  setCopied(true);
                  window.setTimeout(() => setCopied(false), 1200);
                }}
              >
                {copied ? <Check /> : <Copy />}
              </Button>
            </div>

            <ShikiHighlighter
              language="jsx"
              theme="github-dark"
              addDefaultStyles={false}
              rootStyle={{ padding: "12px" }}
              showLanguage={false}
              className="mt-4 overflow-x-auto rounded-lg border border-border bg-background/40 font-mono text-xs text-muted-foreground"
            >
              {`import { xraySchema } from "@gozargah/xray-schema/with-snippets";

const input = JSON.parse(userJson);
const parsed = xraySchema.safeParse(input);

if (!parsed.success) console.error(parsed.error.issues);
else runXray(parsed.data);`}
            </ShikiHighlighter>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default App;

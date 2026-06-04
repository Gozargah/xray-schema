import { createHighlighterCore } from "shiki/core";
import { createOnigurumaEngine } from "shiki/engine/oniguruma";

export const highlighter = await createHighlighterCore({
  themes: [
    // instead of strings, you need to pass the imported module
    import("@shikijs/themes/vitesse-dark"),
    import("@shikijs/themes/vitesse-light"),
  ],
  langs: [import("@shikijs/langs/json")],
  engine: createOnigurumaEngine(import("shiki/wasm")),
});

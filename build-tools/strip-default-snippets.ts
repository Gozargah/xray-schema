import MagicString from "magic-string";
import { parse } from "@babel/parser";
import bTraverse from "@babel/traverse";
import type { UserConfig } from "tsdown/config";

const traverse = (bTraverse as any).default as typeof bTraverse;

export function stripDefaultSnippets() {
  return {
    name: "strip-default-snippets",
    enforce: "post",
    transform(code, id) {
      if (id.includes("node_modules") || !/\.(ts|tsx|js|jsx)$/.test(id)) {
        return null;
      }

      if (!code.includes(".meta(") || !code.includes("defaultSnippets")) {
        return null;
      }

      const ast = parse(code, {
        sourceType: "module",
        plugins: ["typescript", "jsx"],
      });

      const s = new MagicString(code);
      const removals: (number | null | undefined)[][] = [];

      traverse(ast, {
        CallExpression(path) {
          const node = path.node;

          if (
            node.callee.type !== "MemberExpression" ||
            node.callee.computed ||
            node.callee.property.type !== "Identifier" ||
            node.callee.property.name !== "meta"
          ) {
            return;
          }

          const arg = node.arguments[0];
          if (!arg || arg.type !== "ObjectExpression") return;

          for (const prop of arg.properties) {
            if (
              prop.type === "ObjectProperty" &&
              prop.key.type === "Identifier" &&
              prop.key.name === "defaultSnippets"
            ) {
              const pStart = prop.start!;
              const pEnd = prop.end!;
              const beforeSlice = code.slice(0, pStart);
              const afterSlice = code.slice(pEnd);

              const beforeMatch = beforeSlice.match(/([\s,]*)$/);
              const removeStart = pStart - (beforeMatch ? beforeMatch[1]!.length : 0);

              const afterMatch = afterSlice.match(/^([\s,]*)/);
              const removeEnd = pEnd + (afterMatch ? afterMatch[1]!.length : 0);

              removals.push([removeStart, removeEnd]);
            }
          }
        },
      });

      removals.sort((a, b) => b[0]! - a[0]!);

      for (const [start, end] of removals) {
        s.remove(start!, end!);
      }

      return {
        code: s.toString(),
        map: s.generateMap({ hires: true }),
      };
    },
  } as UserConfig["plugins"];
}

import MagicString from "magic-string";
import { parse } from "@babel/parser";
import bTraverse from "@babel/traverse";
import type { UserConfig } from "tsdown/config";

const traverse = (bTraverse as any).default as typeof bTraverse;

export function removeMetaCalls() {
  return {
    name: "remove-meta-calls",
    enforce: "post",
    transform(code, id) {
      if (id.includes("node_modules") || !/\.(ts|tsx|js|jsx)$/.test(id)) {
        return null;
      }

      if (!code.includes(".meta(")) {
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
          // remove only `.meta(...)`
          removals.push([node.callee.object.end, node.end]);
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

// oxlint-disable no-unused-vars
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import type { ZodObject } from "zod";
import type { UserConfig } from "tsdown/config";

const generateFile = async (module: string, output: string) => {
  function getZodLiteralValues(fieldSchema: any): string[] {
    const def = fieldSchema?.def ?? fieldSchema;
    if (!def) return [];
    if (def.type === "literal") return (def.values ?? []).map(String);
    if (def.type === "union")
      return (def.options ?? []).flatMap((o: any) => getZodLiteralValues(o));
    if (def.type === "optional" || def.type === "nullable")
      return getZodLiteralValues(def.innerType);
    return [];
  }

  function resolveRef(schema: any, root: any): any {
    const ref = schema?.$ref;
    if (!ref || typeof ref !== "string" || !ref.startsWith("#/")) return schema;
    const parts = ref
      .slice(2)
      .split("/")
      .map((s: string) => s.replace(/~1/g, "/").replace(/~0/g, "~"));
    let node = root;
    for (const p of parts) {
      node = node?.[p];
      if (node == null) return schema;
    }
    return node;
  }

  function collectProperties(
    schema: any,
    root: any,
    seen = new Set<string>(),
  ): Record<string, any> {
    const ref = schema?.$ref;
    if (ref) {
      if (seen.has(ref)) return {};
      seen.add(ref);
    }
    const resolved = resolveRef(schema, root);
    if (!resolved || typeof resolved !== "object") return {};
    const result: Record<string, any> = { ...resolved.properties };
    for (const sub of [
      ...(resolved.allOf ?? []),
      ...(resolved.anyOf ?? []),
      ...(resolved.oneOf ?? []),
    ]) {
      for (const [k, v] of Object.entries(collectProperties(sub, root, seen))) {
        if (!(k in result)) result[k] = v;
      }
    }
    return result;
  }

  function collectRequired(schema: any, root: any, seen = new Set<string>()): string[] {
    const ref = schema?.$ref;
    if (ref) {
      if (seen.has(ref)) return [];
      seen.add(ref);
    }
    const resolved = resolveRef(schema, root);
    if (!resolved) return [];
    return [
      ...(resolved.required ?? []),
      ...(resolved.allOf ?? []).flatMap((s: any) => collectRequired(s, root, seen)),
    ];
  }

  const { xraySchema } = await import(module + "?date=" + new Date().toString());

  const json = (xraySchema as ZodObject).toJSONSchema({
    unrepresentable: "any",
    target: "draft-07",
    reused: "ref",
    override(ctx) {
      if (!ctx.jsonSchema.ifThenLogic) return ctx;

      const zodDef = (ctx.zodSchema as any).def;
      const primaryDisc: string = zodDef?.discriminator || ctx.jsonSchema.discriminator;
      if (!primaryDisc) return ctx;

      const variants: any[] = ctx.jsonSchema.oneOf ?? ctx.jsonSchema.anyOf ?? [];
      const zodOptions: any[] = zodDef?.options ?? [];
      if (!variants.length || variants.length !== zodOptions.length) return ctx;

      const secondaryDisc = ctx.jsonSchema.secondaryDiscriminator as string | undefined;
      const isDual =
        secondaryDisc != null && zodOptions.some((opt) => secondaryDisc in (opt.def?.shape ?? {}));

      if (isDual) {
        ctx.jsonSchema.primaryDiscriminator = primaryDisc;
        ctx.jsonSchema._dualVariantMeta = zodOptions.map((opt) => {
          const shape: Record<string, any> = opt.def?.shape ?? {};
          return {
            primaryVals: getZodLiteralValues(shape[primaryDisc]),
            secondaryVals: getZodLiteralValues(shape[secondaryDisc!]),
            ownFields: Object.keys(shape).filter((k) => k !== primaryDisc && k !== secondaryDisc),
          };
        });
        return ctx;
      }

      applySingleDiscriminator(ctx, primaryDisc, variants, zodOptions);
    },
  });

  postProcessDual(json);
  await writeFileSync(output, JSON.stringify(json, null, 2));

  // ─── post-processor ───────────────────────────────────────────────────────

  function postProcessDual(root: any) {
    function visit(node: any) {
      if (!node || typeof node !== "object" || Array.isArray(node)) return;
      if (node.primaryDiscriminator && node.secondaryDiscriminator && node._dualVariantMeta) {
        transformDualNode(node, root);
        return;
      }
      for (const val of Object.values(node)) visit(val);
    }
    visit(root);
  }

  function transformDualNode(node: any, root: any) {
    const primaryDisc: string = node.primaryDiscriminator;
    const secondaryDisc: string = node.secondaryDiscriminator;
    const variantMeta: Array<{
      primaryVals: string[];
      secondaryVals: string[];
      ownFields: string[];
    }> = node._dualVariantMeta;
    const variantRefs: any[] = node.oneOf ?? node.anyOf ?? [];

    const infos = variantRefs.map((ref, i) => ({
      primaryVals: variantMeta[i]!.primaryVals,
      secondaryVals: variantMeta[i]!.secondaryVals,
      ownFields: variantMeta[i]!.ownFields,
      properties: collectProperties(ref, root),
      required: collectRequired(ref, root),
    }));

    function buildLogicalGroups(discKey: "primaryVals" | "secondaryVals") {
      const valueToInfos = new Map<string, typeof infos>();
      for (const info of infos) {
        for (const val of info[discKey]) {
          if (!valueToInfos.has(val)) valueToInfos.set(val, []);
          valueToInfos.get(val)!.push(info);
        }
      }

      const valueToIntersection = new Map<string, Set<string>>();
      for (const [val, groupInfos] of valueToInfos) {
        const sets = groupInfos.map((v) => new Set(v.ownFields));
        const intersection = sets.reduce((acc, s) => new Set([...acc].filter((x) => s.has(x))));
        valueToIntersection.set(val, intersection);
      }

      const sigToGroup = new Map<
        string,
        { values: string[]; intersection: Set<string>; groupInfos: typeof infos }
      >();
      for (const [val, intersection] of valueToIntersection) {
        const sig = JSON.stringify([...intersection].sort());
        if (!sigToGroup.has(sig)) {
          sigToGroup.set(sig, { values: [], intersection, groupInfos: valueToInfos.get(val)! });
        }
        sigToGroup.get(sig)!.values.push(val);
      }

      return [...sigToGroup.values()];
    }

    function classifyFields(
      logicalGroups: ReturnType<typeof buildLogicalGroups>,
      alreadyClaimed?: Set<string>,
    ) {
      const fieldToGroup = new Map<string, ReturnType<typeof buildLogicalGroups>[number]>();
      for (const group of logicalGroups) {
        for (const f of group.intersection) {
          if (alreadyClaimed?.has(f)) continue;
          const uniqueToGroup = logicalGroups
            .filter((g) => g !== group)
            .every((g) => !g.intersection.has(f));
          if (uniqueToGroup) fieldToGroup.set(f, group);
        }
      }
      return fieldToGroup;
    }

    const primaryGroups = buildLogicalGroups("primaryVals");
    const secondaryGroups = buildLogicalGroups("secondaryVals");
    const primaryFieldToGroup = classifyFields(primaryGroups);
    const secondaryFieldToGroup = classifyFields(
      secondaryGroups,
      new Set(primaryFieldToGroup.keys()),
    );

    // All conditional fields across both discriminators
    const allPrimaryFields = new Set(primaryFieldToGroup.keys());
    const allSecondaryFields = new Set(secondaryFieldToGroup.keys());

    function buildConditions(
      discKey: string,
      logicalGroups: ReturnType<typeof buildLogicalGroups>,
      fieldToGroup: ReturnType<typeof classifyFields>,
      // All fields owned by this discriminator (to forbid the ones not in current group)
      allOwnedFields: Set<string>,
    ) {
      return logicalGroups.map((currentGroup) => {
        const { values, groupInfos } = currentGroup;
        const own = [...fieldToGroup.entries()]
          .filter(([, g]) => g === currentGroup)
          .map(([f]) => f);
        const forbidden = [...allOwnedFields].filter((f) => !own.includes(f));

        const sampleInfo =
          groupInfos.find((info) => own.every((f) => f in info.properties)) ?? groupInfos[0]!;

        const thenProps: Record<string, any> = {};
        // Fields that belong to this group: include their schemas
        for (const f of own) thenProps[f] = sampleInfo.properties[f] ?? {};
        // Fields that belong to sibling groups: forbid them explicitly
        // (false schema = never valid = validation error if present)
        for (const f of forbidden) thenProps[f] = false;

        const then: Record<string, any> = { properties: thenProps };
        const requiredOwn = own.filter((f) => sampleInfo.required.includes(f));
        if (requiredOwn.length) then.required = requiredOwn;

        const valueCondition = values.length === 1 ? { const: values[0] } : { enum: values };
        return {
          if: { properties: { [discKey]: valueCondition }, required: [discKey] },
          // oxlint-disable-next-line unicorn/no-thenable
          then,
        };
      });
    }

    const allOf = [
      ...buildConditions(primaryDisc, primaryGroups, primaryFieldToGroup, allPrimaryFields),
      ...buildConditions(secondaryDisc, secondaryGroups, secondaryFieldToGroup, allSecondaryFields),
    ];

    const allFields = new Set(infos.flatMap((v) => v.ownFields));
    const commonFields = [...allFields].filter(
      (f) => !allPrimaryFields.has(f) && !allSecondaryFields.has(f),
    );
    const richestInfo = infos.reduce((best, cur) =>
      Object.keys(cur.properties).length > Object.keys(best.properties).length ? cur : best,
    );

    // Base properties: ONLY the two discriminator enums + truly common fields
    // (sockopt, finalmask, etc.).
    //
    // Conditional fields (wsSettings, tlsSettings, etc.) are intentionally
    // omitted here and defined only inside their then-blocks.
    //
    // unevaluatedProperties:false (understood by VS Code's JSON language server
    // even in draft-07 files) considers a property "evaluated" if any active
    // allOf branch's then-block defines it. This means:
    //   - unknown keys like "asdfa" → validation error (not in any branch)
    //   - wsSettings when network is "grpc" → validation error (branch not active)
    //   - VS Code completions: only properties from satisfied branches appear
    //
    // additionalProperties:false would require ALL properties listed at the
    // base level, causing VS Code to suggest every conditional field always.
    const baseProps: Record<string, any> = {
      [primaryDisc]: { enum: [...new Set(infos.flatMap((v) => v.primaryVals))] },
      [secondaryDisc]: { enum: [...new Set(infos.flatMap((v) => v.secondaryVals))] },
    };
    for (const f of commonFields) baseProps[f] = richestInfo.properties[f] ?? {};

    delete node.oneOf;
    delete node.anyOf;
    delete node.ifThenLogic;
    delete node.primaryDiscriminator;
    delete node.secondaryDiscriminator;
    delete node._dualVariantMeta;
    node.type = "object";
    node.properties = baseProps;
    node.unevaluatedProperties = false;
    node.allOf = allOf;
  }

  // ─── single discriminator (original logic) ───────────────────────────────

  function applySingleDiscriminator(
    ctx: any,
    discriminator: string,
    variants: any[],
    zodOptions: any[],
  ) {
    const allValues: string[] = [];
    const discriminatedFields: string[] = Array.isArray(ctx.jsonSchema.discriminatedFields)
      ? ctx.jsonSchema.discriminatedFields
      : [];

    const allOf = variants.map((variant: any, i: number) => {
      const shape = zodOptions[i]?.def?.shape ?? {};
      const values = getZodLiteralValues(shape[discriminator]);
      allValues.push(...values);

      const conditional: any = {
        if: {
          properties: {
            [discriminator]: values.length === 1 ? { const: values[0] } : { enum: values },
          },
          required: [discriminator],
        },
      };
      Reflect.set(conditional, "then", variant);
      return conditional;
    });

    const {
      ifThenLogic: _,
      oneOf: __,
      anyOf: ___,
      secondaryDiscriminator: ____,
      ...rest
    } = ctx.jsonSchema;
    delete ctx.jsonSchema.oneOf;
    delete ctx.jsonSchema.anyOf;
    delete ctx.jsonSchema.ifThenLogic;
    delete ctx.jsonSchema.secondaryDiscriminator;
    ctx.jsonSchema.properties = {
      ...rest.properties,
      [discriminator]: { enum: [...new Set(allValues)] },
    };
    ctx.jsonSchema.allOf = allOf;
  }
};

export const generateJsonSchema = () => {
  return {
    name: "generate-json-schema",
    enforce: "post",
    async writeBundle(options: any, bundle: any) {
      await generateFile(
        join(options.dir!, bundle["index.js"]!.fileName),
        join(options.dir!, "schema.json"),
      );
    },
  } as UserConfig["plugins"];
};

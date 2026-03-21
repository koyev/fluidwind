import plugin from "tailwindcss/plugin";
import type { FluidWindConfig, FluidWindOptions, FluidScale } from "./types";
import { FLUID_UTILITIES } from "./utilities/registry";
import { parseValue } from "./parser/parseValue";
import { resolveRange } from "./range/resolve";
import { toPx, buildClamp } from "./math";
import { buildColorClamp } from "./color/interpolate";

/**
 * Maps each FluidWindConfig scale key to the utility names it drives.
 * `spacing` acts as a general fallback for all spacing utilities;
 * more specific keys (padding, margin, gap, sizing) override or extend it.
 */
const SEMANTIC_GROUPS: Array<{
  key: keyof FluidWindConfig;
  utilities: string[];
}> = [
  { key: "fontSize",     utilities: ["text"] },
  { key: "spacing",      utilities: ["p","px","py","pt","pb","pl","pr","m","mx","my","mt","mb","ml","mr","gap","gap-x","gap-y","w","h","min-w","max-w","min-h","max-h"] },
  { key: "padding",      utilities: ["p","px","py","pt","pb","pl","pr"] },
  { key: "margin",       utilities: ["m","mx","my","mt","mb","ml","mr"] },
  { key: "gap",          utilities: ["gap","gap-x","gap-y"] },
  { key: "sizing",       utilities: ["w","h","min-w","max-w","min-h","max-h"] },
  { key: "borderWidth",  utilities: ["border"] },
  { key: "borderRadius", utilities: ["rounded"] },
];

/** Converts a FluidScale entry tuple to the value string the handler expects. */
function scaleToValues(scale: FluidScale): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [name, [min, max]] of Object.entries(scale)) {
    out[name] = `${min}-${max}`;
  }
  return out;
}

export default plugin.withOptions(
  (options: FluidWindOptions = {}) =>
    ({ matchUtilities, theme }) => {
      // remBase resolution: options → theme config → 16
      const remBase: number =
        options.remBase ?? theme("fluidwind.remBase") ?? 16;

      const config: FluidWindConfig = theme("fluidwind") ?? {};

      const handlers: Record<
        string,
        (value: string, extra: { modifier: string | null }) => Record<string, string> | null
      > = {};

      for (const [name, def] of Object.entries(FLUID_UTILITIES)) {
        handlers[`fw-${name}`] = (
          value: string,
          { modifier }: { modifier: string | null },
        ) => {
          const parsed = parseValue(value);
          if (!parsed) return null;

          const range = resolveRange(modifier, config);

          if (parsed.kind === "color") {
            if (!def.colorProperty) return null;
            return {
              [def.colorProperty]: buildColorClamp({
                minColor: parsed.minColor,
                maxColor: parsed.maxColor,
                wMin: range.wMin,
                wMax: range.wMax,
              }),
            };
          }

          // Numeric
          if (!def.numericProperty) return null;

          const vMin = toPx(parsed.min, { remBase, viewportPx: range.wMin });
          const vMax = toPx(parsed.max, { remBase, viewportPx: range.wMax });

          return {
            [def.numericProperty]: buildClamp({
              vMin,
              vMax,
              wMin: range.wMin,
              wMax: range.wMax,
              remBase,
            }),
          };
        };
      }

      // Build per-utility semantic values by merging all relevant scale groups.
      // Later groups for the same utility name extend (not replace) earlier ones.
      const utilityValues = new Map<string, Record<string, string>>();
      for (const { key, utilities } of SEMANTIC_GROUPS) {
        const scale = config[key] as FluidScale | undefined;
        if (!scale || Object.keys(scale).length === 0) continue;
        const values = scaleToValues(scale);
        for (const utilName of utilities) {
          utilityValues.set(utilName, { ...utilityValues.get(utilName), ...values });
        }
      }

      // Group utilities with identical resolved values into one matchUtilities
      // call each. Utilities with no semantic values share a single values:{} call.
      const noSemanticHandlers: typeof handlers = {};
      const semanticGroups = new Map<string, { values: Record<string, string>; handlers: typeof handlers }>();

      for (const utilName of Object.keys(FLUID_UTILITIES)) {
        const handler = handlers[`fw-${utilName}`];
        const values = utilityValues.get(utilName);
        if (!values) {
          noSemanticHandlers[`fw-${utilName}`] = handler;
        } else {
          const fingerprint = JSON.stringify(Object.entries(values).sort());
          if (!semanticGroups.has(fingerprint)) {
            semanticGroups.set(fingerprint, { values, handlers: {} });
          }
          semanticGroups.get(fingerprint)!.handlers[`fw-${utilName}`] = handler;
        }
      }

      if (Object.keys(noSemanticHandlers).length > 0) {
        matchUtilities(noSemanticHandlers, { values: {}, modifiers: "any" });
      }
      for (const { values, handlers: groupHandlers } of semanticGroups.values()) {
        matchUtilities(groupHandlers, { values, modifiers: "any" });
      }
    },
);

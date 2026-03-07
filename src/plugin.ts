import plugin from "tailwindcss/plugin";
import type { FluidWindConfig, FluidWindOptions } from "./types";
import { FLUID_UTILITIES } from "./utilities/registry";
import { parseValue } from "./parser/parseValue";
import { resolveRange } from "./range/resolve";
import { toPx, buildClamp } from "./math";
import { buildColorClamp } from "./color/interpolate";

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

      matchUtilities(handlers, { values: {}, modifiers: "any" });
    },
);

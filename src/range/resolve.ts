import type { FluidWindConfig, ResolvedRange } from "../types";

const FALLBACK: ResolvedRange = { wMin: 375, wMax: 1440 };

/** Converts a range string like "375px", "1440px", or "1440" to px number. */
function toRangePx(str: string): number {
  const match = str.trim().match(/^(\d+(?:\.\d+)?)(px|rem)?$/);
  if (!match) throw new Error(`Invalid range value: "${str}"`);
  const value = parseFloat(match[1]);
  // rem is rare for ranges but supported; assume remBase 16
  return match[2] === "rem" ? value * 16 : value;
}

function parseTuple(min: string, max: string): ResolvedRange {
  return { wMin: toRangePx(min), wMax: toRangePx(max) };
}

/**
 * Resolves the active viewport range from the Tailwind modifier and config.
 *
 * Priority:
 *  1. Inline modifier   e.g. /[400-1200]  →  { wMin: 400, wMax: 1200 }
 *  2. Named modifier    e.g. /post        →  config.ranges.post
 *  3. Config default    config.defaultRange
 *  4. Hardcoded fallback  [375, 1440]
 */
export function resolveRange(
  modifier: string | null,
  config: FluidWindConfig,
): ResolvedRange {
  // 1. Inline: [400-1200] or [375px-1440px]
  if (modifier?.startsWith("[") && modifier.endsWith("]")) {
    const inner = modifier.slice(1, -1);
    // Simple split - viewport widths are always positive, no sign ambiguity
    const dashIdx = inner.search(/\d-\d/);
    if (dashIdx !== -1) {
      const minStr = inner.slice(0, dashIdx + 1);
      const maxStr = inner.slice(dashIdx + 2);
      return parseTuple(minStr, maxStr);
    }
    return FALLBACK;
  }

  // 2. Named range
  if (modifier && config.ranges && modifier in config.ranges) {
    const [min, max] = config.ranges[modifier];
    return parseTuple(min, max);
  }

  // 3. Config default
  if (config.defaultRange) {
    const [min, max] = config.defaultRange;
    return parseTuple(min, max);
  }

  // 4. Hardcoded fallback
  return FALLBACK;
}

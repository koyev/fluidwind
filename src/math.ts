import type { ParsedNumber } from "./types";

// ---------------------------------------------------------------------------
// Unit normalization
// ---------------------------------------------------------------------------

/**
 * Converts a ParsedNumber to a canonical pixel value.
 * For vw/% units, `opts.viewportPx` is required.
 */
export function toPx(
  parsed: ParsedNumber,
  opts: { remBase?: number; viewportPx?: number } = {},
): number {
  const { remBase = 16, viewportPx } = opts;

  switch (parsed.unit) {
    case "px":
      return parsed.value;

    case "rem":
      return parsed.value * remBase;

    case "vw":
    case "%":
      if (viewportPx === undefined) {
        throw new Error(
          `Cannot convert "${parsed.raw}" to px without a viewport reference`,
        );
      }
      return (parsed.value / 100) * viewportPx;

    case "unitless":
      // Bare numbers are treated as px
      return parsed.value;
  }
}

/** Formats a px number as a rem string, stripping unnecessary trailing zeros. */
export function toRemString(px: number, remBase = 16): string {
  return `${parseFloat((px / remBase).toFixed(4))}rem`;
}

// ---------------------------------------------------------------------------
// Clamp math
// ---------------------------------------------------------------------------

export interface ClampInput {
  /** Minimum output value in px (value at wMin viewport). */
  vMin: number;
  /** Maximum output value in px (value at wMax viewport). */
  vMax: number;
  /** Minimum viewport width in px. */
  wMin: number;
  /** Maximum viewport width in px. */
  wMax: number;
  remBase?: number;
}

/**
 * Builds a CSS clamp() expression that linearly interpolates between vMin and
 * vMax across the wMin→wMax viewport range.
 *
 * Math:
 *   slope     = (vMax - vMin) / (wMax - wMin)
 *   intercept = vMin - slope * wMin
 *   output    = clamp(smaller_rem, slope*100vw + intercept_rem, larger_rem)
 *
 * All inputs are in px; output uses rem for accessibility.
 */
export function buildClamp({
  vMin,
  vMax,
  wMin,
  wMax,
  remBase = 16,
}: ClampInput): string {
  // Edge cases - no interpolation needed
  if (vMin === vMax) return toRemString(vMin, remBase);
  if (wMin === wMax) return toRemString(vMin, remBase);

  const slope = (vMax - vMin) / (wMax - wMin);
  const intercept = vMin - slope * wMin;

  const slopeVw = parseFloat((slope * 100).toFixed(4));
  const interceptRem = parseFloat((intercept / remBase).toFixed(4));

  const minRem = toRemString(Math.min(vMin, vMax), remBase);
  const maxRem = toRemString(Math.max(vMin, vMax), remBase);
  const middle = formatMiddle(slopeVw, interceptRem);

  return `clamp(${minRem}, ${middle}, ${maxRem})`;
}

function formatMiddle(slopeVw: number, interceptRem: number): string {
  const slope = `${slopeVw}vw`;
  if (interceptRem === 0) return slope;
  const abs = parseFloat(Math.abs(interceptRem).toFixed(4));
  return interceptRem > 0
    ? `${slope} + ${abs}rem`
    : `${slope} - ${abs}rem`;
}

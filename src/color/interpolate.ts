import type { RGBColor } from "../types";

function componentToHex(c: number): string {
  return Math.round(c).toString(16).padStart(2, "0");
}

export function rgbToHex({ r, g, b }: RGBColor): string {
  return `#${componentToHex(r)}${componentToHex(g)}${componentToHex(b)}`;
}

/**
 * Builds a color-mix() expression that smoothly transitions from minColor
 * (at wMin) to maxColor (at wMax) using a clamp()-driven percentage.
 *
 * The percentage must be a pure <percentage> type for color-mix() — mixing
 * vw (<length>) with % directly is invalid there. We use tan(atan2(100vw, 1px))
 * to convert the viewport width to a dimensionless <number>, then multiply by
 * 1% to produce a valid <percentage>.
 *
 * Math:
 *   pct = clamp(0, 100 * (wMax - viewport_px) / (wMax - wMin), 100) * 1%
 *   where viewport_px = tan(atan2(100vw, 1px))
 *
 * Output:
 *   color-mix(in srgb, <minHex> calc(clamp(0, …, 100) * 1%), <maxHex>)
 */
export function buildColorClamp(input: {
  minColor: RGBColor;
  maxColor: RGBColor;
  wMin: number;
  wMax: number;
}): string {
  const { minColor, maxColor, wMin, wMax } = input;

  const range = wMax - wMin;
  const pct = `calc(clamp(0, 100 * (${wMax} - tan(atan2(100vw, 1px))) / ${range}, 100) * 1%)`;

  return `color-mix(in srgb, ${rgbToHex(minColor)} ${pct}, ${rgbToHex(maxColor)})`;
}

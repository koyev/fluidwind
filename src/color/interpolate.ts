import type { RGBColor } from "../types";

function componentToHex(c: number): string {
  return Math.round(c).toString(16).padStart(2, "0");
}

export function rgbToHex({ r, g, b }: RGBColor): string {
  return `#${componentToHex(r)}${componentToHex(g)}${componentToHex(b)}`;
}

function formatMiddle(slopeVw: number, intercept: number): string {
  const slopeStr = `${slopeVw}vw`;
  if (intercept === 0) return slopeStr;
  const abs = parseFloat(Math.abs(intercept).toFixed(4));
  return intercept > 0 ? `${slopeStr} + ${abs}%` : `${slopeStr} - ${abs}%`;
}

/**
 * Builds a color-mix() expression that smoothly transitions from minColor
 * (at wMin) to maxColor (at wMax) using a clamp()-driven percentage.
 *
 * Math:
 *   slope     = -100 / (wMax - wMin)   [%/px]
 *   intercept = 100 - slope * wMin     [%]
 *   pct       = clamp(0%, slope_vw*vw + intercept%, 100%)
 *
 * Output:
 *   color-mix(in srgb, <minHex> clamp(0%, …, 100%), <maxHex>)
 */
export function buildColorClamp(input: {
  minColor: RGBColor;
  maxColor: RGBColor;
  wMin: number;
  wMax: number;
}): string {
  const { minColor, maxColor, wMin, wMax } = input;

  const slope = -100 / (wMax - wMin);
  const intercept = 100 - slope * wMin;

  const slopeVw = parseFloat((slope * 100).toFixed(4));
  const interceptPct = parseFloat(intercept.toFixed(4));

  const middle = formatMiddle(slopeVw, interceptPct);
  const clamp = `clamp(0%, ${middle}, 100%)`;

  return `color-mix(in srgb, ${rgbToHex(minColor)} ${clamp}, ${rgbToHex(maxColor)})`;
}

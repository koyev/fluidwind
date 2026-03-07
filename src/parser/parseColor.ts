import type { ParsedFluidColor, RGBColor } from "../types";

function hexToRGB(hex: string): RGBColor | null {
  if (!hex.startsWith("#")) return null;
  const h = hex.slice(1);

  let r: number, g: number, b: number;

  if (h.length === 3) {
    r = parseInt(h[0] + h[0], 16);
    g = parseInt(h[1] + h[1], 16);
    b = parseInt(h[2] + h[2], 16);
  } else if (h.length === 6) {
    r = parseInt(h.slice(0, 2), 16);
    g = parseInt(h.slice(2, 4), 16);
    b = parseInt(h.slice(4, 6), 16);
  } else {
    return null;
  }

  if (isNaN(r) || isNaN(g) || isNaN(b)) return null;
  return { r, g, b };
}

/**
 * Parses a color range string like "#ff0000-#0000ff" or "#f00-#00f".
 * Returns null for any invalid input.
 */
export function parseColor(valueStr: string): ParsedFluidColor | null {
  // Match exactly two hex colors separated by a dash
  const match = valueStr.match(
    /^(#[0-9a-fA-F]{3,6})-(#[0-9a-fA-F]{3,6})$/,
  );
  if (!match) return null;

  const [, minRaw, maxRaw] = match;

  const minColor = hexToRGB(minRaw);
  const maxColor = hexToRGB(maxRaw);
  if (!minColor || !maxColor) return null;

  return { kind: "color", minColor, maxColor, minRaw, maxRaw };
}

import type { ParsedNumber, ParsedValue } from "../types";
import { parseColor } from "./parseColor";

const NUMBER_RE = /^(-?\d+(?:\.\d+)?)(px|rem|vw|%)?$/;

// Splits on a `-` that is preceded by a unit char or digit and followed by
// an optional negative sign then a digit. Safe in Node.js; do not use in
// legacy browser contexts.
const SEPARATOR_RE = /(?<=[a-z%\d])-(?=-?\d)/;

function parseNumber(str: string): ParsedNumber | null {
  const match = str.trim().match(NUMBER_RE);
  if (!match) return null;
  return {
    raw: str.trim(),
    value: parseFloat(match[1]),
    unit: (match[2] as ParsedNumber["unit"]) ?? "unitless",
  };
}

/**
 * Parses the arbitrary-value string Tailwind provides (bracket contents) into
 * a typed ParsedValue, or null if the string is unrecognised.
 *
 * Examples:
 *   "16px-32px"     → ParsedFluidValue  (numeric)
 *   "1rem-4rem"     → ParsedFluidValue  (numeric, mixed units fine)
 *   "-20px--60px"   → ParsedFluidValue  (negative values)
 *   "#ff0000-#0000ff" → ParsedFluidColor (color)
 */
export function parseValue(rawArbitrary: string): ParsedValue | null {
  if (rawArbitrary.includes("#")) {
    return parseColor(rawArbitrary);
  }

  const parts = rawArbitrary.split(SEPARATOR_RE);
  if (parts.length !== 2) return null;

  const min = parseNumber(parts[0]);
  const max = parseNumber(parts[1]);
  if (!min || !max) return null;

  return { kind: "numeric", min, max };
}

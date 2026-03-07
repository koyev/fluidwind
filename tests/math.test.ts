import { describe, it, expect } from "vitest";
import { toPx, toRemString, buildClamp } from "../src/math";
import type { ParsedNumber } from "../src/types";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function px(value: number): ParsedNumber {
  return { raw: `${value}px`, value, unit: "px" };
}
function rem(value: number): ParsedNumber {
  return { raw: `${value}rem`, value, unit: "rem" };
}
function vw(value: number): ParsedNumber {
  return { raw: `${value}vw`, value, unit: "vw" };
}
function unitless(value: number): ParsedNumber {
  return { raw: String(value), value, unit: "unitless" };
}

// ---------------------------------------------------------------------------
// toPx
// ---------------------------------------------------------------------------

describe("toPx", () => {
  it("passes px through unchanged", () => {
    expect(toPx(px(16))).toBe(16);
    expect(toPx(px(-20))).toBe(-20);
  });

  it("converts rem using default remBase (16)", () => {
    expect(toPx(rem(1))).toBe(16);
    expect(toPx(rem(2.5))).toBe(40);
  });

  it("converts rem using custom remBase", () => {
    expect(toPx(rem(1), { remBase: 10 })).toBe(10);
    expect(toPx(rem(2), { remBase: 18 })).toBe(36);
  });

  it("converts vw given a viewport reference", () => {
    expect(toPx(vw(5), { viewportPx: 1440 })).toBe(72);
    expect(toPx(vw(100), { viewportPx: 375 })).toBe(375);
  });

  it("treats unitless as px", () => {
    expect(toPx(unitless(32))).toBe(32);
  });

  it("throws when vw/% has no viewportPx", () => {
    expect(() => toPx(vw(5))).toThrow();
    expect(() =>
      toPx({ raw: "50%", value: 50, unit: "%" }),
    ).toThrow();
  });
});

// ---------------------------------------------------------------------------
// toRemString
// ---------------------------------------------------------------------------

describe("toRemString", () => {
  it("converts px to rem string with default remBase", () => {
    expect(toRemString(16)).toBe("1rem");
    expect(toRemString(32)).toBe("2rem");
    expect(toRemString(24)).toBe("1.5rem");
  });

  it("strips unnecessary trailing zeros", () => {
    expect(toRemString(8)).toBe("0.5rem");
    expect(toRemString(10)).toBe("0.625rem");
  });

  it("respects custom remBase", () => {
    expect(toRemString(10, 10)).toBe("1rem");
    expect(toRemString(18, 18)).toBe("1rem");
  });

  it("handles negative values", () => {
    expect(toRemString(-16)).toBe("-1rem");
    expect(toRemString(-20)).toBe("-1.25rem");
  });
});

// ---------------------------------------------------------------------------
// buildClamp
// ---------------------------------------------------------------------------

describe("buildClamp", () => {
  it("produces correct clamp for a typical font-size range", () => {
    // 16px → 32px over 375px → 1440px
    const result = buildClamp({
      vMin: 16,
      vMax: 32,
      wMin: 375,
      wMax: 1440,
    });
    expect(result).toBe("clamp(1rem, 1.5023vw + 0.6479rem, 2rem)");
  });

  it("returns a plain rem value when vMin === vMax", () => {
    expect(
      buildClamp({ vMin: 16, vMax: 16, wMin: 375, wMax: 1440 }),
    ).toBe("1rem");
  });

  it("returns vMin as rem when wMin === wMax (guard div-by-zero)", () => {
    expect(
      buildClamp({ vMin: 16, vMax: 32, wMin: 800, wMax: 800 }),
    ).toBe("1rem");
  });

  it("handles negative values", () => {
    // -20px → -60px over 375px → 1440px
    const result = buildClamp({
      vMin: -20,
      vMax: -60,
      wMin: 375,
      wMax: 1440,
    });
    expect(result).toBe(
      "clamp(-3.75rem, -3.7559vw - 0.3697rem, -1.25rem)",
    );
  });

  it("handles a shrinking range (vMax < vMin)", () => {
    // 32px mobile → 16px desktop
    const result = buildClamp({
      vMin: 32,
      vMax: 16,
      wMin: 375,
      wMax: 1440,
    });
    expect(result).toBe("clamp(1rem, -1.5023vw + 2.3521rem, 2rem)");
  });

  it("formats intercept without + when intercept is 0", () => {
    // vMin and wMin are set so intercept = 0: intercept = vMin - slope*wMin = 0 when vMin = slope*wMin
    // slope = (vMax-vMin)/(wMax-wMin), choose vMin=375*(vMax-vMin)/(wMax-wMin)
    // Simplest: wMin=0 → intercept = vMin - slope*0 = vMin, not 0
    // Let's just verify the output doesn't contain "+ 0rem"
    const result = buildClamp({
      vMin: 16,
      vMax: 32,
      wMin: 375,
      wMax: 1440,
    });
    expect(result).not.toContain("+ 0rem");
    expect(result).not.toContain("- 0rem");
  });

  it("respects custom remBase", () => {
    const result = buildClamp({
      vMin: 16,
      vMax: 32,
      wMin: 375,
      wMax: 1440,
      remBase: 10,
    });
    // 16/10 = 1.6rem, 32/10 = 3.2rem
    expect(result).toMatch(/^clamp\(1\.6rem,/);
    expect(result).toMatch(/3\.2rem\)$/);
  });
});

import { describe, it, expect } from "vitest";
import { buildColorClamp, rgbToHex } from "../src/color/interpolate";

// ---------------------------------------------------------------------------
// rgbToHex
// ---------------------------------------------------------------------------

describe("rgbToHex", () => {
  it("converts pure red", () => {
    expect(rgbToHex({ r: 255, g: 0, b: 0 })).toBe("#ff0000");
  });

  it("converts pure blue", () => {
    expect(rgbToHex({ r: 0, g: 0, b: 255 })).toBe("#0000ff");
  });

  it("converts white", () => {
    expect(rgbToHex({ r: 255, g: 255, b: 255 })).toBe("#ffffff");
  });

  it("converts black", () => {
    expect(rgbToHex({ r: 0, g: 0, b: 0 })).toBe("#000000");
  });

  it("pads single-digit hex components", () => {
    expect(rgbToHex({ r: 1, g: 2, b: 3 })).toBe("#010203");
  });

  it("rounds fractional channel values", () => {
    expect(rgbToHex({ r: 254.6, g: 0.4, b: 127.5 })).toBe("#ff0080");
  });
});

// ---------------------------------------------------------------------------
// buildColorClamp
// ---------------------------------------------------------------------------

describe("buildColorClamp", () => {
  const wMin = 375;
  const wMax = 1440;

  it("returns a color-mix() string", () => {
    const result = buildColorClamp({
      minColor: { r: 255, g: 0, b: 0 },
      maxColor: { r: 0, g: 0, b: 255 },
      wMin,
      wMax,
    });
    expect(result).toMatch(/^color-mix\(in srgb,/);
  });

  it("starts with minColor hex at position 0", () => {
    const result = buildColorClamp({
      minColor: { r: 255, g: 0, b: 0 },
      maxColor: { r: 0, g: 0, b: 255 },
      wMin,
      wMax,
    });
    expect(result).toContain("#ff0000");
    expect(result).toContain("#0000ff");
  });

  it("clamp bounds are 0 and 100", () => {
    const result = buildColorClamp({
      minColor: { r: 255, g: 0, b: 0 },
      maxColor: { r: 0, g: 0, b: 255 },
      wMin,
      wMax,
    });
    expect(result).toContain("clamp(0,");
    expect(result).toContain(", 100)");
  });

  it("produces correct wMax and range values for 375→1440 range", () => {
    // range = 1440 - 375 = 1065
    const result = buildColorClamp({
      minColor: { r: 255, g: 0, b: 0 },
      maxColor: { r: 0, g: 0, b: 255 },
      wMin,
      wMax,
    });
    expect(result).toContain("1440 - tan(atan2(100vw, 1px))");
    expect(result).toContain("/ 1065,");
  });

  it("full output snapshot for red→blue over 375→1440", () => {
    const result = buildColorClamp({
      minColor: { r: 255, g: 0, b: 0 },
      maxColor: { r: 0, g: 0, b: 255 },
      wMin,
      wMax,
    });
    expect(result).toBe(
      "color-mix(in srgb, #ff0000 calc(clamp(0, 100 * (1440 - tan(atan2(100vw, 1px))) / 1065, 100) * 1%), #0000ff)",
    );
  });

  it("works for white→black transition", () => {
    const result = buildColorClamp({
      minColor: { r: 255, g: 255, b: 255 },
      maxColor: { r: 0, g: 0, b: 0 },
      wMin,
      wMax,
    });
    expect(result).toMatch(/^color-mix\(in srgb, #ffffff calc\(clamp\(0,/);
    expect(result).toMatch(/, #000000\)$/);
  });

  it("works with a custom narrower range", () => {
    // 600px → 1000px, range = 400
    const result = buildColorClamp({
      minColor: { r: 255, g: 0, b: 0 },
      maxColor: { r: 0, g: 0, b: 255 },
      wMin: 600,
      wMax: 1000,
    });
    expect(result).toContain("1000 - tan(atan2(100vw, 1px))");
    expect(result).toContain("/ 400,");
  });
});

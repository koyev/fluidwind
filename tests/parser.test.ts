import { describe, it, expect } from "vitest";
import { parseColor } from "../src/parser/parseColor";
import { parseValue } from "../src/parser/parseValue";

// ---------------------------------------------------------------------------
// parseColor
// ---------------------------------------------------------------------------

describe("parseColor", () => {
  it("parses full hex colors", () => {
    const result = parseColor("#ff0000-#0000ff");
    expect(result).toEqual({
      kind: "color",
      minColor: { r: 255, g: 0, b: 0 },
      maxColor: { r: 0, g: 0, b: 255 },
      minRaw: "#ff0000",
      maxRaw: "#0000ff",
    });
  });

  it("parses shorthand hex colors (#rgb)", () => {
    const result = parseColor("#f00-#00f");
    expect(result).not.toBeNull();
    expect(result!.minColor).toEqual({ r: 255, g: 0, b: 0 });
    expect(result!.maxColor).toEqual({ r: 0, g: 0, b: 255 });
    expect(result!.minRaw).toBe("#f00");
    expect(result!.maxRaw).toBe("#00f");
  });

  it("parses mixed shorthand and full hex", () => {
    const result = parseColor("#fff-#000000");
    expect(result).not.toBeNull();
    expect(result!.minColor).toEqual({ r: 255, g: 255, b: 255 });
    expect(result!.maxColor).toEqual({ r: 0, g: 0, b: 0 });
  });

  it("parses mid-range colors", () => {
    const result = parseColor("#336699-#ff8800");
    expect(result).not.toBeNull();
    expect(result!.minColor).toEqual({ r: 0x33, g: 0x66, b: 0x99 });
    expect(result!.maxColor).toEqual({ r: 0xff, g: 0x88, b: 0x00 });
  });

  it("returns null for a single color (no range)", () => {
    expect(parseColor("#ff0000")).toBeNull();
  });

  it("returns null for invalid hex characters", () => {
    expect(parseColor("#gggggg-#000000")).toBeNull();
  });

  it("returns null for wrong hex length", () => {
    expect(parseColor("#ff00-#0000ff")).toBeNull();
  });

  it("returns null for missing #", () => {
    expect(parseColor("ff0000-0000ff")).toBeNull();
  });

  it("returns null for empty string", () => {
    expect(parseColor("")).toBeNull();
  });

  it("preserves kind discriminant", () => {
    const result = parseColor("#abc-#def");
    expect(result?.kind).toBe("color");
  });
});

// ---------------------------------------------------------------------------
// parseValue - numeric paths
// ---------------------------------------------------------------------------

describe("parseValue (numeric)", () => {
  it("parses px values", () => {
    const result = parseValue("16px-32px");
    expect(result).toEqual({
      kind: "numeric",
      min: { raw: "16px", value: 16, unit: "px" },
      max: { raw: "32px", value: 32, unit: "px" },
    });
  });

  it("parses rem values", () => {
    const result = parseValue("1rem-4rem");
    expect(result?.kind).toBe("numeric");
    if (result?.kind !== "numeric") return;
    expect(result.min).toEqual({
      raw: "1rem",
      value: 1,
      unit: "rem",
    });
    expect(result.max).toEqual({
      raw: "4rem",
      value: 4,
      unit: "rem",
    });
  });

  it("parses unitless values (treated as px)", () => {
    const result = parseValue("16-32");
    expect(result?.kind).toBe("numeric");
    if (result?.kind !== "numeric") return;
    expect(result.min.unit).toBe("unitless");
    expect(result.min.value).toBe(16);
    expect(result.max.value).toBe(32);
  });

  it("parses mixed units", () => {
    const result = parseValue("10px-2rem");
    expect(result?.kind).toBe("numeric");
    if (result?.kind !== "numeric") return;
    expect(result.min).toEqual({
      raw: "10px",
      value: 10,
      unit: "px",
    });
    expect(result.max).toEqual({
      raw: "2rem",
      value: 2,
      unit: "rem",
    });
  });

  it("parses vw values", () => {
    const result = parseValue("10px-5vw");
    expect(result?.kind).toBe("numeric");
    if (result?.kind !== "numeric") return;
    expect(result.max).toEqual({ raw: "5vw", value: 5, unit: "vw" });
  });

  it("parses percentage values", () => {
    const result = parseValue("50%-100%");
    expect(result?.kind).toBe("numeric");
    if (result?.kind !== "numeric") return;
    expect(result.min.unit).toBe("%");
    expect(result.max.unit).toBe("%");
  });

  it("parses decimal values", () => {
    const result = parseValue("1.5rem-3.75rem");
    expect(result?.kind).toBe("numeric");
    if (result?.kind !== "numeric") return;
    expect(result.min.value).toBe(1.5);
    expect(result.max.value).toBe(3.75);
  });

  it("parses negative min value", () => {
    const result = parseValue("-20px-60px");
    expect(result?.kind).toBe("numeric");
    if (result?.kind !== "numeric") return;
    expect(result.min.value).toBe(-20);
    expect(result.max.value).toBe(60);
  });

  it("parses negative max value", () => {
    const result = parseValue("20px--60px");
    expect(result?.kind).toBe("numeric");
    if (result?.kind !== "numeric") return;
    expect(result.min.value).toBe(20);
    expect(result.max.value).toBe(-60);
  });

  it("parses both negative values", () => {
    const result = parseValue("-20px--60px");
    expect(result?.kind).toBe("numeric");
    if (result?.kind !== "numeric") return;
    expect(result.min.value).toBe(-20);
    expect(result.max.value).toBe(-60);
  });

  it("returns null for a single value with no range", () => {
    expect(parseValue("16px")).toBeNull();
  });

  it("returns null for empty string", () => {
    expect(parseValue("")).toBeNull();
  });

  it("returns null for completely invalid input", () => {
    expect(parseValue("abc-def")).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// parseValue - color delegation
// ---------------------------------------------------------------------------

describe("parseValue (color delegation)", () => {
  it("delegates to parseColor when input contains #", () => {
    const result = parseValue("#ff0000-#0000ff");
    expect(result?.kind).toBe("color");
  });

  it("returns null when delegated color parse fails", () => {
    expect(parseValue("#gggggg-#000000")).toBeNull();
  });
});

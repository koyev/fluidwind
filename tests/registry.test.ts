import { describe, it, expect } from "vitest";
import { FLUID_UTILITIES } from "../src/utilities/registry";

describe("FLUID_UTILITIES", () => {
  it("contains all expected utility keys", () => {
    const expected = [
      "text",
      "p", "px", "py", "pt", "pb", "pl", "pr",
      "m", "mx", "my", "mt", "mb", "ml", "mr",
      "w", "h", "min-w", "max-w", "min-h", "max-h",
      "gap", "gap-x", "gap-y",
      "border", "rounded",
      "bg",
    ];
    for (const key of expected) {
      expect(FLUID_UTILITIES).toHaveProperty(key);
    }
  });

  it("text has both numericProperty and colorProperty", () => {
    expect(FLUID_UTILITIES.text.numericProperty).toBe("font-size");
    expect(FLUID_UTILITIES.text.colorProperty).toBe("color");
  });

  it("bg has colorProperty only (no numericProperty)", () => {
    expect(FLUID_UTILITIES.bg.colorProperty).toBe("background-color");
    expect(FLUID_UTILITIES.bg.numericProperty).toBeUndefined();
  });

  it("spacing utilities map to correct CSS properties", () => {
    expect(FLUID_UTILITIES.p.numericProperty).toBe("padding");
    expect(FLUID_UTILITIES.px.numericProperty).toBe("padding-inline");
    expect(FLUID_UTILITIES.py.numericProperty).toBe("padding-block");
    expect(FLUID_UTILITIES.pt.numericProperty).toBe("padding-top");
    expect(FLUID_UTILITIES.pb.numericProperty).toBe("padding-bottom");
    expect(FLUID_UTILITIES.pl.numericProperty).toBe("padding-left");
    expect(FLUID_UTILITIES.pr.numericProperty).toBe("padding-right");

    expect(FLUID_UTILITIES.m.numericProperty).toBe("margin");
    expect(FLUID_UTILITIES.mx.numericProperty).toBe("margin-inline");
    expect(FLUID_UTILITIES.my.numericProperty).toBe("margin-block");
    expect(FLUID_UTILITIES.mt.numericProperty).toBe("margin-top");
    expect(FLUID_UTILITIES.mb.numericProperty).toBe("margin-bottom");
    expect(FLUID_UTILITIES.ml.numericProperty).toBe("margin-left");
    expect(FLUID_UTILITIES.mr.numericProperty).toBe("margin-right");
  });

  it("sizing utilities map to correct CSS properties", () => {
    expect(FLUID_UTILITIES.w.numericProperty).toBe("width");
    expect(FLUID_UTILITIES.h.numericProperty).toBe("height");
    expect(FLUID_UTILITIES["min-w"].numericProperty).toBe("min-width");
    expect(FLUID_UTILITIES["max-w"].numericProperty).toBe("max-width");
    expect(FLUID_UTILITIES["min-h"].numericProperty).toBe("min-height");
    expect(FLUID_UTILITIES["max-h"].numericProperty).toBe("max-height");
  });

  it("layout utilities map to correct CSS properties", () => {
    expect(FLUID_UTILITIES.gap.numericProperty).toBe("gap");
    expect(FLUID_UTILITIES["gap-x"].numericProperty).toBe("column-gap");
    expect(FLUID_UTILITIES["gap-y"].numericProperty).toBe("row-gap");
  });

  it("decoration utilities map to correct CSS properties", () => {
    expect(FLUID_UTILITIES.border.numericProperty).toBe("border-width");
    expect(FLUID_UTILITIES.rounded.numericProperty).toBe("border-radius");
  });

  it("non-color utilities have no colorProperty", () => {
    const numericOnly = ["p", "m", "w", "h", "gap", "border", "rounded"];
    for (const key of numericOnly) {
      expect(FLUID_UTILITIES[key].colorProperty).toBeUndefined();
    }
  });
});

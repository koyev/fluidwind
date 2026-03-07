import { describe, it, expect } from "vitest";
import { resolveRange } from "../src/range/resolve";
import type { FluidWindConfig } from "../src/types";

const emptyConfig: FluidWindConfig = {};

const fullConfig: FluidWindConfig = {
  defaultRange: ["600px", "1200px"],
  ranges: {
    post: ["600px", "1000px"],
    wide: ["1024px", "1920px"],
  },
};

// ---------------------------------------------------------------------------
// Hardcoded fallback
// ---------------------------------------------------------------------------

describe("resolveRange - fallback", () => {
  it("returns 375/1440 when modifier is null and config is empty", () => {
    expect(resolveRange(null, emptyConfig)).toEqual({
      wMin: 375,
      wMax: 1440,
    });
  });
});

// ---------------------------------------------------------------------------
// Config default
// ---------------------------------------------------------------------------

describe("resolveRange - config defaultRange", () => {
  it("uses config.defaultRange when modifier is null", () => {
    expect(resolveRange(null, fullConfig)).toEqual({
      wMin: 600,
      wMax: 1200,
    });
  });

  it("parses unitless numbers in defaultRange", () => {
    const cfg: FluidWindConfig = { defaultRange: ["320", "1280"] };
    expect(resolveRange(null, cfg)).toEqual({
      wMin: 320,
      wMax: 1280,
    });
  });
});

// ---------------------------------------------------------------------------
// Named modifier
// ---------------------------------------------------------------------------

describe("resolveRange - named modifier", () => {
  it("resolves a named range from config", () => {
    expect(resolveRange("post", fullConfig)).toEqual({
      wMin: 600,
      wMax: 1000,
    });
  });

  it("resolves another named range", () => {
    expect(resolveRange("wide", fullConfig)).toEqual({
      wMin: 1024,
      wMax: 1920,
    });
  });

  it("falls back to config.defaultRange for an unknown name", () => {
    expect(resolveRange("unknown", fullConfig)).toEqual({
      wMin: 600,
      wMax: 1200,
    });
  });

  it("falls back to hardcoded when name unknown and no defaultRange", () => {
    expect(resolveRange("unknown", emptyConfig)).toEqual({
      wMin: 375,
      wMax: 1440,
    });
  });
});

// ---------------------------------------------------------------------------
// Inline modifier
// ---------------------------------------------------------------------------

describe("resolveRange - inline modifier", () => {
  it("parses unitless inline range [400-1200]", () => {
    expect(resolveRange("[400-1200]", emptyConfig)).toEqual({
      wMin: 400,
      wMax: 1200,
    });
  });

  it("parses px inline range [375px-1440px]", () => {
    expect(resolveRange("[375px-1440px]", emptyConfig)).toEqual({
      wMin: 375,
      wMax: 1440,
    });
  });

  it("inline modifier takes priority over config defaultRange", () => {
    expect(resolveRange("[800-1600]", fullConfig)).toEqual({
      wMin: 800,
      wMax: 1600,
    });
  });

  it("inline modifier takes priority over named ranges", () => {
    // Even if 'post' is defined, an inline modifier wins
    expect(resolveRange("[500-900]", fullConfig)).toEqual({
      wMin: 500,
      wMax: 900,
    });
  });
});

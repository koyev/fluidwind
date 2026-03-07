import { describe, it, expect } from "vitest";
import postcss from "postcss";
import tailwind from "tailwindcss";
import fluidwindPlugin from "../src/plugin";

const BASE_CONFIG = {
  content: [] as { raw: string; extension: string }[],
  plugins: [
    fluidwindPlugin({}) as ReturnType<typeof fluidwindPlugin>,
  ],
  theme: {
    fluidwind: {
      defaultRange: ["375px", "1440px"] as [string, string],
      ranges: {
        post: ["600px", "1000px"] as [string, string],
      },
    },
  },
};

async function run(classes: string[]): Promise<string> {
  const html = `<div class="${classes.join(" ")}"></div>`;
  const result = await postcss([
    tailwind({
      ...BASE_CONFIG,
      content: [{ raw: html, extension: "html" }],
    }),
  ]).process("@tailwind utilities;", { from: undefined });
  return result.css;
}

// ---------------------------------------------------------------------------

describe("fw-text (font-size)", () => {
  it("generates clamp() for px values", async () => {
    const css = await run(["fw-text-[16px-32px]"]);
    expect(css).toContain("font-size");
    expect(css).toContain("clamp(");
    expect(css).toContain("1rem");
    expect(css).toContain("2rem");
  });

  it("generates clamp() for rem values", async () => {
    const css = await run(["fw-text-[1rem-2rem]"]);
    expect(css).toContain("font-size");
    expect(css).toContain("clamp(");
  });
});

describe("fw-p (padding)", () => {
  it("generates clamp() for padding", async () => {
    const css = await run(["fw-p-[16px-64px]"]);
    expect(css).toContain("padding");
    expect(css).toContain("clamp(");
  });
});

describe("fw-bg (color)", () => {
  it("generates color-mix() for background", async () => {
    const css = await run(["fw-bg-[#ff0000-#0000ff]"]);
    expect(css).toContain("background-color");
    expect(css).toContain("color-mix(in srgb");
    expect(css).toContain("#ff0000");
    expect(css).toContain("#0000ff");
  });
});

describe("fw-text (color)", () => {
  it("generates color-mix() for text color", async () => {
    const css = await run(["fw-text-[#000000-#ffffff]"]);
    expect(css).toContain("color");
    expect(css).toContain("color-mix(in srgb");
  });
});

describe("range modifiers", () => {
  it("uses named range /post", async () => {
    // post: 600px → 1000px, narrower range → steeper slope than default
    const [defaultCss, postCss] = await Promise.all([
      run(["fw-text-[16px-32px]"]),
      run(["fw-text-[16px-32px]/post"]),
    ]);
    // Both should have clamp() but with different slopes
    expect(postCss).toContain("clamp(");
    // The vw coefficient differs between ranges
    expect(defaultCss).not.toBe(postCss);
  });

  it("uses inline range /[400-1200]", async () => {
    const css = await run(["fw-text-[16px-32px]/[400-1200]"]);
    expect(css).toContain("clamp(");
    expect(css).toContain("font-size");
  });
});

describe("negative values", () => {
  it("handles negative margin values", async () => {
    const css = await run(["fw-mt-[-20px--60px]"]);
    expect(css).toContain("margin-top");
    expect(css).toContain("clamp(");
    // Both bounds are negative
    expect(css).toContain("-");
  });
});

describe("mixed units", () => {
  it("handles px → rem mix", async () => {
    const css = await run(["fw-p-[10px-2rem]"]);
    expect(css).toContain("padding");
    expect(css).toContain("clamp(");
  });
});

describe("invalid / missing values", () => {
  it("produces no output for a non-range value", async () => {
    // fw-text-[16px] has no separator - parser returns null, no CSS emitted
    const css = await run(["fw-text-[16px]"]);
    expect(css).not.toContain("font-size");
  });
});

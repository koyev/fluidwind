import { describe, it, expect } from "vitest";
import postcss from "postcss";
import tailwind from "tailwindcss";
import fluidwindPlugin from "../src/plugin";

async function run(
  classes: string[],
  fluidwindConfig: Record<string, unknown>,
): Promise<string> {
  const html = `<div class="${classes.join(" ")}"></div>`;
  const result = await postcss([
    tailwind({
      content: [{ raw: html, extension: "html" }],
      plugins: [fluidwindPlugin({}) as ReturnType<typeof fluidwindPlugin>],
      theme: {
        fluidwind: {
          defaultRange: ["375px", "1440px"] as [string, string],
          ...fluidwindConfig,
        },
      },
    }),
  ]).process("@tailwind utilities;", { from: undefined });
  return result.css;
}

// ---------------------------------------------------------------------------

describe("semantic fontSize scale", () => {
  it("fw-text-md resolves to correct font-size clamp", async () => {
    const css = await run(["fw-text-md"], {
      fontSize: { md: ["16px", "24px"] },
    });
    expect(css).toContain("font-size");
    expect(css).toContain("clamp(1rem, 0.7512vw + 0.8239rem, 1.5rem)");
  });

  it("fw-text-lg resolves with a different scale entry", async () => {
    const css = await run(["fw-text-lg"], {
      fontSize: { lg: ["20px", "40px"] },
    });
    expect(css).toContain("font-size");
    expect(css).toContain("clamp(");
    expect(css).toContain("1.25rem"); // 20px / 16
    expect(css).toContain("2.5rem"); // 40px / 16
  });

  it("arbitrary fw-text-[…] still works alongside semantic scale", async () => {
    const css = await run(["fw-text-[14px-28px]"], {
      fontSize: { md: ["16px", "24px"] },
    });
    expect(css).toContain("font-size");
    expect(css).toContain("clamp(");
  });
});

describe("semantic padding scale", () => {
  it("fw-p-layout resolves to correct padding clamp", async () => {
    const css = await run(["fw-p-layout"], {
      padding: { layout: ["1rem", "3rem"] },
    });
    expect(css).toContain("padding");
    expect(css).toContain("clamp(1rem, 3.0047vw + 0.2958rem, 3rem)");
  });

  it("fw-px-layout uses the same padding scale", async () => {
    const css = await run(["fw-px-layout"], {
      padding: { layout: ["1rem", "3rem"] },
    });
    expect(css).toContain("padding-inline");
    expect(css).toContain("clamp(1rem, 3.0047vw + 0.2958rem, 3rem)");
  });
});

describe("semantic spacing scale (shared across padding/margin/gap)", () => {
  it("fw-p-base uses spacing scale", async () => {
    const css = await run(["fw-p-base"], {
      spacing: { base: ["8px", "16px"] },
    });
    expect(css).toContain("padding");
    expect(css).toContain("clamp(");
  });

  it("fw-m-base uses spacing scale", async () => {
    const css = await run(["fw-m-base"], {
      spacing: { base: ["8px", "16px"] },
    });
    expect(css).toContain("margin");
    expect(css).toContain("clamp(");
  });

  it("fw-gap-base uses spacing scale", async () => {
    const css = await run(["fw-gap-base"], {
      spacing: { base: ["8px", "16px"] },
    });
    expect(css).toContain("gap");
    expect(css).toContain("clamp(");
  });
});

describe("no output for unknown semantic keys", () => {
  it("fw-text-unknown produces no font-size when key not in scale", async () => {
    const css = await run(["fw-text-unknown"], {
      fontSize: { md: ["16px", "24px"] },
    });
    expect(css).not.toContain("font-size");
  });
});

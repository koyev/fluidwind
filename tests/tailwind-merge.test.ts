import { describe, it, expect } from "vitest";
import { extendTailwindMerge } from "tailwind-merge";
import { withFluidwind } from "../src/tailwind-merge";

const twMerge = extendTailwindMerge(withFluidwind());

describe("withFluidwind — fw- vs fw- conflicts (last wins)", () => {
  it("fw-p-[…] deduplicates", () => {
    expect(twMerge("fw-p-[4px-8px] fw-p-[8px-16px]")).toBe("fw-p-[8px-16px]");
  });
  it("fw-text-[…] deduplicates", () => {
    expect(twMerge("fw-text-[12px-24px] fw-text-[16px-32px]")).toBe(
      "fw-text-[16px-32px]",
    );
  });
  it("fw-m-[…] deduplicates", () => {
    expect(twMerge("fw-m-[4px-16px] fw-m-[8px-24px]")).toBe("fw-m-[8px-24px]");
  });
  it("fw-gap-[…] deduplicates", () => {
    expect(twMerge("fw-gap-[4px-16px] fw-gap-[8px-24px]")).toBe(
      "fw-gap-[8px-24px]",
    );
  });
});

describe("withFluidwind — fw- overrides standard Tailwind (last wins)", () => {
  it("fw-p overrides p", () => {
    expect(twMerge("p-4 fw-p-[1rem-2rem]")).toBe("fw-p-[1rem-2rem]");
  });
  it("fw-text overrides text-sm", () => {
    expect(twMerge("text-sm fw-text-[16px-32px]")).toBe("fw-text-[16px-32px]");
  });
  it("fw-m overrides m", () => {
    expect(twMerge("m-4 fw-m-[8px-32px]")).toBe("fw-m-[8px-32px]");
  });
  it("fw-px overrides px", () => {
    expect(twMerge("px-6 fw-px-[12px-48px]")).toBe("fw-px-[12px-48px]");
  });
  it("fw-gap overrides gap", () => {
    expect(twMerge("gap-4 fw-gap-[8px-24px]")).toBe("fw-gap-[8px-24px]");
  });
  it("fw-w overrides w", () => {
    expect(twMerge("w-64 fw-w-[200px-600px]")).toBe("fw-w-[200px-600px]");
  });
});

describe("withFluidwind — standard Tailwind overrides fw- (last wins)", () => {
  it("gap overrides fw-gap", () => {
    expect(twMerge("fw-gap-[4px-16px] gap-8")).toBe("gap-8");
  });
  it("p overrides fw-p", () => {
    expect(twMerge("fw-p-[8px-32px] p-4")).toBe("p-4");
  });
  it("text-sm overrides fw-text", () => {
    expect(twMerge("fw-text-[16px-32px] text-sm")).toBe("text-sm");
  });
});

describe("withFluidwind — exact examples from spec", () => {
  it('twMerge("fw-p-4 fw-p-8") -> "fw-p-8"', () => {
    expect(twMerge("fw-p-4 fw-p-8")).toBe("fw-p-8");
  });
  it('twMerge("p-4 fw-p-[1rem-2rem]") -> "fw-p-[1rem-2rem]"', () => {
    expect(twMerge("p-4 fw-p-[1rem-2rem]")).toBe("fw-p-[1rem-2rem]");
  });
  it('twMerge("text-sm fw-text-lg") -> "fw-text-lg"', () => {
    expect(twMerge("text-sm fw-text-lg")).toBe("fw-text-lg");
  });
  it('twMerge("fw-gap-4 gap-8") -> "gap-8"', () => {
    expect(twMerge("fw-gap-4 gap-8")).toBe("gap-8");
  });
});

describe("withFluidwind — unrelated classes are preserved", () => {
  it("unrelated classes survive", () => {
    expect(twMerge("flex items-center fw-p-[8px-24px] text-white")).toBe(
      "flex items-center fw-p-[8px-24px] text-white",
    );
  });
  it("fw-px and fw-py do not conflict with each other", () => {
    expect(twMerge("fw-px-[8px-24px] fw-py-[4px-16px]")).toBe(
      "fw-px-[8px-24px] fw-py-[4px-16px]",
    );
  });
});

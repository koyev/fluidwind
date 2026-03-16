import { extendTailwindMerge, type ConfigExtension } from "tailwind-merge";

// Maps every fw-{key} prefix to the tailwind-merge class group it conflicts with.
// Keys are tailwind-merge's internal group IDs; values extend those groups with
// a fw-{key}-* pattern whose validator accepts any suffix (arbitrary or named).
const any = () => true;

const FLUID_GROUPS = {
  // Typography
  "font-size": [{ "fw-text": [any] }],
  "text-color": [{ "fw-text": [any] }],

  // Padding
  p: [{ "fw-p": [any] }],
  px: [{ "fw-px": [any] }],
  py: [{ "fw-py": [any] }],
  pt: [{ "fw-pt": [any] }],
  pb: [{ "fw-pb": [any] }],
  pl: [{ "fw-pl": [any] }],
  pr: [{ "fw-pr": [any] }],

  // Margin
  m: [{ "fw-m": [any] }],
  mx: [{ "fw-mx": [any] }],
  my: [{ "fw-my": [any] }],
  mt: [{ "fw-mt": [any] }],
  mb: [{ "fw-mb": [any] }],
  ml: [{ "fw-ml": [any] }],
  mr: [{ "fw-mr": [any] }],

  // Sizing
  w: [{ "fw-w": [any] }],
  h: [{ "fw-h": [any] }],
  "min-w": [{ "fw-min-w": [any] }],
  "max-w": [{ "fw-max-w": [any] }],
  "min-h": [{ "fw-min-h": [any] }],
  "max-h": [{ "fw-max-h": [any] }],

  // Layout
  gap: [{ "fw-gap": [any] }],
  "gap-x": [{ "fw-gap-x": [any] }],
  "gap-y": [{ "fw-gap-y": [any] }],

  // Decoration
  "border-w": [{ "fw-border": [any] }],
  rounded: [{ "fw-rounded": [any] }],

  // Background
  "bg-color": [{ "fw-bg": [any] }],
} as const;

type MergeConfig = ConfigExtension<string, string>;

/**
 * Returns a tailwind-merge config extension that teaches tailwind-merge about
 * all `fw-*` utility prefixes so they correctly conflict with — and override —
 * their standard Tailwind counterparts (and vice-versa).
 *
 * @example
 * import { extendTailwindMerge } from 'tailwind-merge'
 * import { withFluidwind } from 'fluidwind/tailwind-merge'
 *
 * export const twMerge = extendTailwindMerge(withFluidwind())
 */
export function withFluidwind(config: MergeConfig = {}): MergeConfig {
  return {
    ...config,
    extend: {
      ...config.extend,
      classGroups: {
        ...config.extend?.classGroups,
        ...FLUID_GROUPS,
      },
    },
  };
}

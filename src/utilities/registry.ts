export interface UtilityDefinition {
  /** CSS property for numeric clamp values. Absent for color-only utilities. */
  numericProperty?: string;
  /** CSS property for color-mix values. Only set when the utility accepts colors. */
  colorProperty?: string;
}

/**
 * Maps every `fw-{key}` utility name to its CSS output property/properties.
 * "text" accepts both numeric (font-size) and color values.
 * "bg" accepts color values only.
 * All others accept numeric values only.
 */
export const FLUID_UTILITIES: Record<string, UtilityDefinition> = {
  // Typography
  text: { numericProperty: "font-size", colorProperty: "color" },

  // Padding
  p: { numericProperty: "padding" },
  px: { numericProperty: "padding-inline" },
  py: { numericProperty: "padding-block" },
  pt: { numericProperty: "padding-top" },
  pb: { numericProperty: "padding-bottom" },
  pl: { numericProperty: "padding-left" },
  pr: { numericProperty: "padding-right" },

  // Margin
  m: { numericProperty: "margin" },
  mx: { numericProperty: "margin-inline" },
  my: { numericProperty: "margin-block" },
  mt: { numericProperty: "margin-top" },
  mb: { numericProperty: "margin-bottom" },
  ml: { numericProperty: "margin-left" },
  mr: { numericProperty: "margin-right" },

  // Sizing
  w: { numericProperty: "width" },
  h: { numericProperty: "height" },
  "min-w": { numericProperty: "min-width" },
  "max-w": { numericProperty: "max-width" },
  "min-h": { numericProperty: "min-height" },
  "max-h": { numericProperty: "max-height" },

  // Layout
  gap: { numericProperty: "gap" },
  "gap-x": { numericProperty: "column-gap" },
  "gap-y": { numericProperty: "row-gap" },

  // Decoration
  border: { numericProperty: "border-width" },
  rounded: { numericProperty: "border-radius" },

  // Background (color only)
  bg: { colorProperty: "background-color" },
};

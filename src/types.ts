export interface ParsedNumber {
  raw: string;
  value: number;
  unit: "px" | "rem" | "vw" | "%" | "unitless";
}

export interface ResolvedRange {
  wMin: number; // px
  wMax: number; // px
}

export interface ParsedFluidValue {
  kind: "numeric";
  min: ParsedNumber;
  max: ParsedNumber;
}

export interface RGBColor {
  r: number;
  g: number;
  b: number;
}

export interface ParsedFluidColor {
  kind: "color";
  minColor: RGBColor;
  maxColor: RGBColor;
  minRaw: string;
  maxRaw: string;
}

export type ParsedValue = ParsedFluidValue | ParsedFluidColor;

/** A named scale of fluid value pairs: { md: ["16px", "24px"] } */
export type FluidScale = Record<string, [string, string]>;

export interface FluidWindConfig {
  defaultRange?: [string, string];
  ranges?: Record<string, [string, string]>;
  remBase?: number;
  // Semantic theme scales
  fontSize?: FluidScale;
  spacing?: FluidScale;
  padding?: FluidScale;
  margin?: FluidScale;
  gap?: FluidScale;
  sizing?: FluidScale;
  borderWidth?: FluidScale;
  borderRadius?: FluidScale;
}

export interface FluidWindOptions {
  remBase?: number;
}

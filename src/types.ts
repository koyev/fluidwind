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

export interface FluidWindConfig {
  defaultRange?: [string, string];
  ranges?: Record<string, [string, string]>;
  remBase?: number;
}

export interface FluidWindOptions {
  remBase?: number;
}

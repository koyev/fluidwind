export interface ParsedNumber {
  value: number;
  unit: "px" | "rem" | "vw" | "%";
}

export interface ParsedFluidValue {
  min: ParsedNumber;
  max: ParsedNumber;
}

export interface RGBColor {
  r: number;
  g: number;
  b: number;
}

export interface ParsedFluidColor {
  min: RGBColor;
  max: RGBColor;
  minRaw: string;
  maxRaw: string;
}

export interface FluidWindConfig {
  defaultRange?: [string, string];
  ranges?: Record<string, [string, string]>;
  remBase?: number;
}

export interface FluidWindOptions {
  remBase?: number;
}

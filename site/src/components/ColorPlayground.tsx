import { useState, useMemo } from "react";
import { buildColorClamp } from "@plugin/color/interpolate";
import { CopyButton } from "./CopyButton";

interface RGB {
  r: number;
  g: number;
  b: number;
}

function hexToRgb(hex: string): RGB | null {
  const clean = hex.replace("#", "");
  if (clean.length === 3) {
    const r = Number.parseInt(clean[0] + clean[0], 16);
    const g = Number.parseInt(clean[1] + clean[1], 16);
    const b = Number.parseInt(clean[2] + clean[2], 16);
    if (Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b))
      return null;
    return { r, g, b };
  }
  if (clean.length === 6) {
    const r = Number.parseInt(clean.slice(0, 2), 16);
    const g = Number.parseInt(clean.slice(2, 4), 16);
    const b = Number.parseInt(clean.slice(4, 6), 16);
    if (Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b))
      return null;
    return { r, g, b };
  }
  return null;
}

function lerp(a: number, b: number, t: number): number {
  return Math.round(a + (b - a) * t);
}

function rgbToHex({ r, g, b }: RGB): string {
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

const W_MIN = 375;
const W_MAX = 1440;

const PRESETS = [
  { label: "Blue → Cyan", min: "#3b82f6", max: "#22d3ee" },
  { label: "Purple → Pink", min: "#8b5cf6", max: "#ec4899" },
  { label: "Amber → Red", min: "#f59e0b", max: "#ef4444" },
  { label: "Gray → White", min: "#374151", max: "#f9fafb" },
];

export function ColorPlayground() {
  const [minHex, setMinHex] = useState("#3b82f6");
  const [maxHex, setMaxHex] = useState("#22d3ee");
  const [minVp, setMinVp] = useState(W_MIN);
  const [maxVp, setMaxVp] = useState(W_MAX);
  const [viewport, setViewport] = useState(800);

  const pct = ((viewport - W_MIN) / (W_MAX - W_MIN)) * 100;

  const result = useMemo(() => {
    const minColor = hexToRgb(minHex);
    const maxColor = hexToRgb(maxHex);
    if (!minColor || !maxColor || minVp >= maxVp) return null;

    const colorMix = buildColorClamp({
      minColor,
      maxColor,
      wMin: minVp,
      wMax: maxVp,
    });

    const t = Math.max(
      0,
      Math.min(1, (viewport - minVp) / (maxVp - minVp)),
    );
    const interpolated: RGB = {
      r: lerp(minColor.r, maxColor.r, t),
      g: lerp(minColor.g, maxColor.g, t),
      b: lerp(minColor.b, maxColor.b, t),
    };

    return {
      colorMix,
      interpolated: rgbToHex(interpolated),
      fwClass: `fw-bg-[${minHex}-${maxHex}]`,
    };
  }, [minHex, maxHex, minVp, maxVp, viewport]);

  const inputClass =
    "w-full bg-[#1e1e22] border border-[#2a2a30] rounded-lg px-3 py-2.5 font-mono text-sm text-[#f0f0f4] focus:outline-none focus:border-[#22d3ee]/50 transition-colors";

  return (
    <div className="space-y-6">
      {/* Presets */}
      <div className="flex flex-wrap gap-2">
        {PRESETS.map((p) => (
          <button
            key={p.label}
            onClick={() => {
              setMinHex(p.min);
              setMaxHex(p.max);
            }}
            className={`text-xs font-mono px-3 py-1.5 rounded border transition-colors ${
              minHex === p.min && maxHex === p.max
                ? "bg-[#22d3ee]/10 border-[#22d3ee]/30 text-[#22d3ee]"
                : "border-[#2a2a30] text-[#8888a0] hover:text-[#f0f0f4] hover:border-[#8888a0]/40"
            }`}
            style={{ borderLeftColor: p.min, borderLeftWidth: "3px" }}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Controls */}
        <div className="space-y-4">
          {/* Color pickers */}
          <div className="bg-[#141416] border border-[#2a2a30] rounded-xl p-5">
            <p className="text-xs font-mono text-[#8888a0] uppercase tracking-widest mb-4">
              Colors
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="minColor"
                  className="text-xs text-[#8888a0] mb-2 block"
                >
                  Min color (at min viewport)
                </label>
                <div className="flex gap-2">
                  <input
                    name="minColor"
                    type="color"
                    value={minHex}
                    onChange={(e) => setMinHex(e.target.value)}
                    className="w-9 h-9 flex-shrink-0 rounded-lg border border-[#2a2a30] bg-[#1e1e22] cursor-pointer p-1"
                    aria-label="Min color picker"
                  />
                  <input
                    type="text"
                    value={minHex}
                    onChange={(e) => setMinHex(e.target.value)}
                    maxLength={7}
                    className={`${inputClass} min-w-0`}
                    spellCheck={false}
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="maxColor"
                  className="text-xs text-[#8888a0] mb-2 block"
                >
                  Max color (at max viewport)
                </label>
                <div className="flex gap-2">
                  <input
                    name="maxColor"
                    type="color"
                    value={maxHex}
                    onChange={(e) => setMaxHex(e.target.value)}
                    className="w-9 h-9 flex-shrink-0 rounded-lg border border-[#2a2a30] bg-[#1e1e22] cursor-pointer p-1"
                    aria-label="Max color picker"
                  />
                  <input
                    type="text"
                    value={maxHex}
                    onChange={(e) => setMaxHex(e.target.value)}
                    maxLength={7}
                    className={`${inputClass} min-w-0`}
                    spellCheck={false}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Viewport range */}
          <div className="bg-[#141416] border border-[#2a2a30] rounded-xl p-5">
            <p className="text-xs font-mono text-[#8888a0] uppercase tracking-widest mb-4">
              Viewport range
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="minVp"
                  className="text-xs text-[#8888a0] mb-1.5 block"
                >
                  Min viewport
                </label>
                <input
                  id="minVp"
                  type="number"
                  value={minVp}
                  onChange={(e) => setMinVp(Number(e.target.value))}
                  className={inputClass}
                />
              </div>
              <div>
                <label
                  htmlFor="maxVp"
                  className="text-xs text-[#8888a0] mb-1.5 block"
                >
                  Max viewport
                </label>
                <input
                  id="maxVp"
                  type="number"
                  value={maxVp}
                  onChange={(e) => setMaxVp(Number(e.target.value))}
                  className={inputClass}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Preview + output */}
        <div className="space-y-4">
          {/* Live preview */}
          <div className="bg-[#141416] border border-[#2a2a30] rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-mono text-[#8888a0] uppercase tracking-widest">
                Preview
              </p>
              <span className="text-xs font-mono text-[#22d3ee]">
                {viewport}px viewport
              </span>
            </div>

            {/* Color swatch */}
            <div
              className="w-full h-20 rounded-lg mb-4 transition-all duration-75"
              style={{
                backgroundColor: result?.interpolated ?? "#888",
              }}
            />

            {/* Gradient bar reference */}
            <div
              className="w-full h-2 rounded-full mb-4"
              style={{
                background: `linear-gradient(to right, ${minHex}, ${maxHex})`,
              }}
            />

            {/* Slider */}
            <input
              type="range"
              min={W_MIN}
              max={W_MAX}
              value={viewport}
              onChange={(e) => setViewport(Number(e.target.value))}
              className="w-full h-1 appearance-none rounded-full cursor-pointer"
              style={{
                background: `linear-gradient(to right, #22d3ee ${pct}%, #2a2a30 ${pct}%)`,
              }}
              aria-label="Simulated viewport width"
            />
            <div className="flex justify-between text-xs font-mono text-[#8888a0]/60 mt-1.5">
              <span>{W_MIN}px</span>
              <span>{W_MAX}px</span>
            </div>
          </div>

          {/* Generated CSS */}
          {result && (
            <div className="bg-[#141416] border border-[#2a2a30] rounded-xl p-5 space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-mono text-[#8888a0] uppercase tracking-widest">
                    Generated CSS
                  </p>
                  <CopyButton
                    text={`background-color: ${result.colorMix}`}
                    label="Copy CSS"
                  />
                </div>
                <code className="font-mono text-sm text-[#22d3ee]/80 break-all leading-relaxed">
                  background-color: {result.colorMix}
                </code>
              </div>
              <div className="pt-4 border-t border-[#2a2a30]">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-mono text-[#8888a0] uppercase tracking-widest">
                    Fluidwind class
                  </p>
                  <CopyButton
                    text={result.fwClass}
                    label="Copy class"
                  />
                </div>
                <code className="font-mono text-sm text-[#f0f0f4] break-all">
                  {result.fwClass}
                </code>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

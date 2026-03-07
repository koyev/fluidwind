import { useState, useMemo } from "react";
import type React from "react";
import { parseValue } from "@plugin/parser/parseValue";
import { buildClamp, toPx } from "@plugin/math";
import { buildColorClamp } from "@plugin/color/interpolate";
import { CopyButton } from "./CopyButton";

const W_MIN_DEFAULT = 375;
const W_MAX_DEFAULT = 1440;
const REM_BASE = 16;

const EXAMPLES = [
  { label: "Text size",       value: "16px-48px",   property: "font-size",  fwClass: "fw-text", previewType: "font-size" as const },
  { label: "Padding",         value: "12px-48px",   property: "padding",    fwClass: "fw-p",    previewType: "padding"   as const },
  { label: "Negative margin", value: "-8px--32px",  property: "margin-top", fwClass: "fw-mt",   previewType: "margin"    as const },
  { label: "Mixed units",     value: "1px-4rem",   property: "font-size",  fwClass: "fw-text", previewType: "font-size" as const },
];

function evalClampAtVp(
  vMin: number,
  vMax: number,
  wMin: number,
  wMax: number,
  vp: number,
): number {
  const slope = (vMax - vMin) / (wMax - wMin);
  const intercept = vMin - slope * wMin;
  const preferred = slope * vp + intercept;
  return Math.max(
    Math.min(vMin, vMax),
    Math.min(Math.max(vMin, vMax), preferred),
  );
}

function lerpColor(
  a: { r: number; g: number; b: number },
  b: { r: number; g: number; b: number },
  t: number,
): string {
  const r = Math.round(a.r + (b.r - a.r) * t);
  const g = Math.round(a.g + (b.g - a.g) * t);
  const bl = Math.round(a.b + (b.b - a.b) * t);
  return `rgb(${r},${g},${bl})`;
}

export function Playground() {
  const [input, setInput] = useState("16px-48px");
  const [viewport, setViewport] = useState(800);
  const [selectedExample, setSelectedExample] = useState(EXAMPLES[0]);

  const parsed = useMemo(() => {
    try {
      return parseValue(input.trim());
    } catch {
      return null;
    }
  }, [input]);

  const { cssOutput, previewStyle, previewType, previewLabel } = useMemo(() => {
    if (!parsed) {
      return { cssOutput: null, previewStyle: {}, previewType: "font-size" as const, previewLabel: "Invalid value" };
    }

    if (parsed.kind === "color") {
      const { minColor, maxColor } = parsed;
      const wMin = W_MIN_DEFAULT;
      const wMax = W_MAX_DEFAULT;
      const t = (viewport - wMin) / (wMax - wMin);
      const colorStr = buildColorClamp({ minColor, maxColor, wMin, wMax });
      const bgColor = lerpColor(minColor, maxColor, Math.max(0, Math.min(1, t)));
      return {
        cssOutput: `background-color: ${colorStr}`,
        previewStyle: { backgroundColor: bgColor },
        previewType: "color" as const,
        previewLabel: `Interpolated at ${viewport}px viewport`,
      };
    }

    const property = selectedExample?.property ?? "font-size";
    const previewKind = selectedExample?.previewType ?? "font-size";
    const wMin = W_MIN_DEFAULT;
    const wMax = W_MAX_DEFAULT;

    let vMinPx: number, vMaxPx: number;
    try {
      // vw/% values are evaluated at wMin/wMax respectively — the semantically correct endpoints
      vMinPx = toPx(parsed.min, { remBase: REM_BASE, viewportPx: wMin });
      vMaxPx = toPx(parsed.max, { remBase: REM_BASE, viewportPx: wMax });
    } catch {
      return { cssOutput: null, previewStyle: {}, previewType: "font-size" as const, previewLabel: "Unsupported unit combination" };
    }

    const clampStr = buildClamp({ vMin: vMinPx, vMax: vMaxPx, wMin, wMax, remBase: REM_BASE });
    const computed = evalClampAtVp(vMinPx, vMaxPx, wMin, wMax, viewport);

    let previewStyle: React.CSSProperties = {};
    if (previewKind === "font-size") {
      previewStyle = { fontSize: `${computed}px`, lineHeight: 1.2 };
    } else if (previewKind === "padding") {
      previewStyle = { padding: `${Math.max(0, computed)}px` };
    } else if (previewKind === "margin") {
      previewStyle = { marginTop: `${computed}px` };
    }

    return {
      cssOutput: `${property}: ${clampStr}`,
      previewStyle,
      previewType: previewKind,
      previewLabel: `${computed.toFixed(1)}px at ${viewport}px viewport`,
    };
  }, [parsed, viewport, selectedExample]);

  const pct =
    ((viewport - W_MIN_DEFAULT) / (W_MAX_DEFAULT - W_MIN_DEFAULT)) *
    100;

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Left: input + controls */}
      <div className="space-y-4 min-w-0">
        {/* Value input */}
        <div className="bg-[#141416] border border-[#2a2a30] rounded-xl p-5">
          <label className="block text-xs font-mono text-[#8888a0] mb-3 uppercase tracking-widest">
            Value (bracket contents)
          </label>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="16px-48px"
            className="w-full bg-[#1e1e22] border border-[#2a2a30] rounded-lg px-4 py-3 font-mono text-sm text-[#f0f0f4] placeholder-[#8888a0]/40 focus:outline-none focus:border-[#22d3ee]/50 transition-colors"
            spellCheck={false}
          />
          <div className="flex flex-wrap gap-2 mt-3">
            {EXAMPLES.map((ex) => (
              <button
                key={ex.value}
                onClick={() => { setInput(ex.value); setSelectedExample(ex); }}
                className={`text-xs font-mono px-2.5 py-1 rounded border transition-colors ${
                  input === ex.value
                    ? "bg-[#22d3ee]/10 border-[#22d3ee]/30 text-[#22d3ee]"
                    : "border-[#2a2a30] text-[#8888a0] hover:text-[#f0f0f4] hover:border-[#8888a0]/40"
                }`}
              >
                {ex.label}
              </button>
            ))}
          </div>
        </div>

        {/* Viewport slider */}
        <div className="bg-[#141416] border border-[#2a2a30] rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <label className="text-xs font-mono text-[#8888a0] uppercase tracking-widest">
              Simulated viewport
            </label>
            <span className="text-xs font-mono text-[#22d3ee]">
              {viewport}px
            </span>
          </div>
          <input
            type="range"
            min={W_MIN_DEFAULT}
            max={W_MAX_DEFAULT}
            value={viewport}
            onChange={(e) => setViewport(Number(e.target.value))}
            className="w-full h-1 appearance-none rounded-full cursor-pointer"
            style={{
              background: `linear-gradient(to right, #22d3ee ${pct}%, #2a2a30 ${pct}%)`,
            }}
            aria-label="Simulated viewport width"
          />
          <div className="flex justify-between text-xs font-mono text-[#8888a0]/60 mt-1.5">
            <span>{W_MIN_DEFAULT}px</span>
            <span>{W_MAX_DEFAULT}px</span>
          </div>
        </div>
      </div>

      {/* Right: preview + output */}
      <div className="space-y-4 min-w-0">
        {/* Preview */}
        <div className="bg-[#141416] border border-[#2a2a30] rounded-xl p-5 min-h-[120px] flex flex-col overflow-hidden">
          <p className="text-xs font-mono text-[#8888a0] uppercase tracking-widest mb-4">
            Preview
          </p>
          <div className="flex-1 flex items-center justify-center overflow-hidden">
            {!parsed || !cssOutput ? (
              <p className="text-[#8888a0] text-sm font-mono">
                {previewLabel || "Invalid value"}
              </p>
            ) : previewType === "color" ? (
              <div className="w-full h-16 rounded-lg transition-all duration-75" style={previewStyle} />
            ) : previewType === "padding" ? (
              <div
                className="border border-[#22d3ee]/40 rounded transition-all duration-75 flex items-center justify-center"
                style={previewStyle}
              >
                <span className="text-xs font-mono text-[#8888a0] bg-[#141416] px-2 py-0.5 rounded">content</span>
              </div>
            ) : previewType === "margin" ? (
              <div className="relative flex flex-col items-center gap-0 w-full">
                <div className="w-full h-8 rounded bg-[#1e1e22] border border-[#2a2a30] flex items-center justify-center">
                  <span className="text-xs font-mono text-[#8888a0]">element above</span>
                </div>
                <div
                  className="w-full h-8 rounded bg-[#22d3ee]/10 border border-[#22d3ee]/30 flex items-center justify-center transition-all duration-75"
                  style={previewStyle}
                >
                  <span className="text-xs font-mono text-[#22d3ee]">this element</span>
                </div>
              </div>
            ) : (
              <p
                className="font-display font-bold text-[#f0f0f4] transition-all duration-75 text-center"
                style={previewStyle}
              >
                Fluid text
              </p>
            )}
          </div>
          <p className="text-xs font-mono text-[#8888a0]/60 mt-3 text-right">
            {previewLabel}
          </p>
        </div>

        {/* Generated CSS */}
        <div className="bg-[#141416] border border-[#2a2a30] rounded-xl p-5 overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-mono text-[#8888a0] uppercase tracking-widest">
              Generated CSS
            </p>
            {cssOutput && (
              <CopyButton text={cssOutput} label="Copy CSS" />
            )}
          </div>
          <pre className="font-mono text-sm overflow-x-auto -mx-5 px-5">
            <code>
              {cssOutput ? (
                <span className="text-[#22d3ee]/90">{cssOutput}</span>
              ) : (
                <span className="text-[#8888a0]/50">-</span>
              )}
            </code>
          </pre>
          {parsed && (
            <div className="mt-4 pt-4 border-t border-[#2a2a30]">
              {(() => {
                const fwClass = parsed.kind === "color"
                  ? `fw-bg-[${input}]`
                  : `${selectedExample?.fwClass ?? "fw-text"}-[${input}]`;
                return (
                  <>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-mono text-[#8888a0] uppercase tracking-widest">
                        Fluidwind class
                      </p>
                      <CopyButton text={fwClass} label="Copy class" />
                    </div>
                    <code className="text-sm font-mono text-[#f0f0f4] break-all">{fwClass}</code>
                  </>
                );
              })()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

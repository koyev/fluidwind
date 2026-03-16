import { useState, useMemo } from "react";
import { buildClamp } from "@plugin/math";
import { CopyButton } from "./CopyButton";

// github-dark-dimmed palette
const C = {
  comment: "#768390",
  atRule: "#6cb6ff",
  selector: "#f69d50",
  property: "#8ddb8c",
  number: "#6cb6ff",
  punct: "#768390",
  base: "#adbac7",
};

function HighlightedCSS({ code }: Readonly<{ code: string }>) {
  type Token = { text: string; color: string };
  const tokens: Token[] = [];
  let s = code;

  while (s.length > 0) {
    let m: RegExpMatchArray | null;

    // Block comment
    m = new RegExp(/^\/\*[\s\S]*?\*\//).exec(s);
    if (m) {
      tokens.push({ text: m[0], color: C.comment });
      s = s.slice(m[0].length);
      continue;
    }
    m = new RegExp(/^@[\w-]+/).exec(s);
    // @-rule keyword
    if (m) {
      tokens.push({ text: m[0], color: C.atRule });
      s = s.slice(m[0].length);
      continue;
    }
    m = new RegExp(/^\.[\w-]+/).exec(s);
    // .selector
    if (m) {
      tokens.push({ text: m[0], color: C.selector });
      s = s.slice(m[0].length);
      continue;
    }
    m = new RegExp(/^([\w-]+)(\s*)(:)/).exec(s);
    // property name followed by colon
    if (m) {
      tokens.push(
        { text: m[1], color: C.property },
        { text: m[2] + m[3], color: C.punct },
      );
      s = s.slice(m[0].length);
      continue;
    }
    m = new RegExp(/^-?[\d.]+(?:rem|px|em|%)\b/).exec(s);
    // number with unit
    if (m) {
      tokens.push({ text: m[0], color: C.number });
      s = s.slice(m[0].length);
      continue;
    }
    m = new RegExp(/^-?[\d.]+/).exec(s);
    // bare number
    if (m) {
      tokens.push({ text: m[0], color: C.number });
      s = s.slice(m[0].length);
      continue;
    }
    m = new RegExp(/^[{}();,]/).exec(s);
    // punctuation
    if (m) {
      tokens.push({ text: m[0], color: C.punct });
      s = s.slice(1);
      continue;
    }
    // everything else (whitespace, other chars)
    tokens.push({ text: s[0], color: C.base });
    s = s.slice(1);
  }

  return (
    <>
      {tokens.map((t, i) => (
        <span key={`${i}-${t.text}`} style={{ color: t.color }}>
          {t.text}
        </span>
      ))}
    </>
  );
}

type Unit = "px" | "rem";

const BREAKPOINT_EQUIV = (minPx: number, maxPx: number): string =>
  `/* Without Fluidwind - 6 breakpoints */
.element {
  font-size: ${(minPx / 16).toFixed(4).replace(/\.?0+$/, "")}rem;        /* 0px+ */
}
@media (min-width: 480px) {
  .element { font-size: ${((minPx + (maxPx - minPx) * 0.2) / 16).toFixed(4).replace(/\.?0+$/, "")}rem; }
}
@media (min-width: 640px) {
  .element { font-size: ${((minPx + (maxPx - minPx) * 0.4) / 16).toFixed(4).replace(/\.?0+$/, "")}rem; }
}
@media (min-width: 768px) {
  .element { font-size: ${((minPx + (maxPx - minPx) * 0.55) / 16).toFixed(4).replace(/\.?0+$/, "")}rem; }
}
@media (min-width: 1024px) {
  .element { font-size: ${((minPx + (maxPx - minPx) * 0.75) / 16).toFixed(4).replace(/\.?0+$/, "")}rem; }
}
@media (min-width: 1280px) {
  .element { font-size: ${((minPx + (maxPx - minPx) * 0.9) / 16).toFixed(4).replace(/\.?0+$/, "")}rem; }
}
@media (min-width: 1440px) {
  .element { font-size: ${(maxPx / 16).toFixed(4).replace(/\.?0+$/, "")}rem; }
}`;

function toPxValue(value: number, unit: Unit, remBase = 16): number {
  return unit === "rem" ? value * remBase : value;
}

function formatValue(px: number, unit: Unit, remBase = 16): string {
  if (unit === "rem")
    return `${Number.parseFloat((px / remBase).toFixed(4))}rem`;
  return `${px}px`;
}

export function Calculator() {
  const [minVal, setMinVal] = useState(16);
  const [maxVal, setMaxVal] = useState(48);
  const [minVp, setMinVp] = useState(375);
  const [maxVp, setMaxVp] = useState(1440);
  const [valUnit, setValUnit] = useState<Unit>("px");
  const [vpUnit, setVpUnit] = useState<Unit>("px");
  const [showBreakpoints, setShowBreakpoints] = useState(false);

  const result = useMemo(() => {
    const vMin = toPxValue(minVal, valUnit);
    const vMax = toPxValue(maxVal, valUnit);
    const wMin = toPxValue(minVp, vpUnit);
    const wMax = toPxValue(maxVp, vpUnit);

    if (
      wMin >= wMax ||
      Number.isNaN(vMin) ||
      Number.isNaN(vMax) ||
      Number.isNaN(wMin) ||
      Number.isNaN(wMax)
    ) {
      return null;
    }

    const clamp = buildClamp({ vMin, vMax, wMin, wMax, remBase: 16 });
    const className = `fw-text-[${formatValue(vMin, valUnit)}-${formatValue(vMax, valUnit)}]`;
    const css = `font-size: ${clamp}`;
    const breakpoints = BREAKPOINT_EQUIV(vMin, vMax);

    return { clamp, className, css, breakpoints, vMin, vMax };
  }, [minVal, maxVal, minVp, maxVp, valUnit, vpUnit]);

  const inputClass =
    "w-full bg-[#1e1e22] border border-[#2a2a30] rounded-lg px-3 py-2.5 font-mono text-sm text-[#f0f0f4] focus:outline-none focus:border-[#22d3ee]/50 transition-colors";

  const unitBtnClass = (active: boolean) =>
    `px-2 py-1 text-xs font-mono rounded border transition-colors ${
      active
        ? "bg-[#22d3ee]/10 border-[#22d3ee]/30 text-[#22d3ee]"
        : "border-[#2a2a30] text-[#8888a0] hover:text-[#f0f0f4]"
    }`;

  return (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="bg-[#141416] border border-[#2a2a30] rounded-xl p-6">
        <div className="grid gap-6 sm:grid-cols-2">
          {/* Values */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-mono text-[#8888a0] uppercase tracking-widest">
                Values
              </p>
              <div className="flex gap-1">
                {(["px", "rem"] as Unit[]).map((u) => (
                  <button
                    key={u}
                    onClick={() => setValUnit(u)}
                    className={unitBtnClass(valUnit === u)}
                  >
                    {u}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="minVal"
                  className="text-xs text-[#8888a0] mb-1.5 block"
                >
                  Min value
                </label>
                <input
                  name="minVal"
                  type="number"
                  value={minVal}
                  onChange={(e) => setMinVal(Number(e.target.value))}
                  className={inputClass}
                />
              </div>
              <div>
                <label
                  htmlFor="maxVal"
                  className="text-xs text-[#8888a0] mb-1.5 block"
                >
                  Max value
                </label>
                <input
                  id="maxVal"
                  name="maxVal"
                  type="number"
                  value={maxVal}
                  onChange={(e) => setMaxVal(Number(e.target.value))}
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* Viewport */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-mono text-[#8888a0] uppercase tracking-widest">
                Viewport
              </p>
              <div className="flex gap-1">
                {(["px", "rem"] as Unit[]).map((u) => (
                  <button
                    key={u}
                    onClick={() => setVpUnit(u)}
                    className={unitBtnClass(vpUnit === u)}
                  >
                    {u}
                  </button>
                ))}
              </div>
            </div>
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
                  name="minVp"
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
                  name="maxVp"
                  type="number"
                  value={maxVp}
                  onChange={(e) => setMaxVp(Number(e.target.value))}
                  className={inputClass}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Outputs */}
      {result ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Generated CSS */}
          <div className="bg-[#141416] border border-[#2a2a30] rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-mono text-[#8888a0] uppercase tracking-widest">
                Generated CSS
              </p>
              <CopyButton text={result.css} label="Copy CSS" />
            </div>
            <code className="block font-mono text-sm text-[#22d3ee]/90 break-all">
              {result.css}
            </code>
          </div>

          {/* Fluidwind class */}
          <div className="bg-[#141416] border border-[#2a2a30] rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-mono text-[#8888a0] uppercase tracking-widest">
                Fluidwind class
              </p>
              <CopyButton
                text={result.className}
                label="Copy class"
              />
            </div>
            <code className="block font-mono text-sm text-[#f0f0f4] break-all">
              {result.className}
            </code>
          </div>
        </div>
      ) : (
        <div className="bg-[#141416] border border-[#2a2a30] rounded-xl p-5 text-center text-[#8888a0] text-sm font-mono">
          Enter valid values above - min viewport must be less than
          max viewport.
        </div>
      )}

      {/* Breakpoint toggle */}
      {result && (
        <div className="bg-[#141416] border border-[#2a2a30] rounded-xl overflow-hidden">
          <button
            onClick={() => setShowBreakpoints((v) => !v)}
            className="w-full flex items-center justify-between px-5 py-4 text-left group"
          >
            <span className="text-sm font-display font-semibold text-[#f0f0f4]">
              What would this be without Fluidwind?
            </span>
            <svg
              className={`transition-transform text-[#8888a0] ${showBreakpoints ? "rotate-180" : ""}`}
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
          {showBreakpoints && (
            <div className="border-t border-[#2a2a30]">
              <div className="flex items-center justify-between px-5 py-3 bg-[--surface2]">
                <p className="text-xs font-mono text-[#fb923c]">
                  7 media queries - still not perfectly smooth
                </p>
                <CopyButton text={result.breakpoints} label="Copy" />
              </div>
              <pre className="px-5 pb-5 font-mono text-xs leading-relaxed overflow-x-auto bg-[--surface2]">
                <HighlightedCSS code={result.breakpoints} />
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

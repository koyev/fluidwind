import { useState } from 'react';

const V_MIN = 28; // px font size at min viewport
const V_MAX = 72; // px font size at max viewport
const W_MIN = 375;
const W_MAX = 1440;

function evalClamp(vp: number): number {
  const slope = (V_MAX - V_MIN) / (W_MAX - W_MIN);
  const intercept = V_MIN - slope * W_MIN;
  const preferred = slope * vp + intercept;
  return Math.max(V_MIN, Math.min(V_MAX, preferred));
}

const CLAMP_CSS = `font-size: clamp(1.75rem, 4.18vw + 0.17rem, 4.5rem)`;

export function HeroSlider() {
  const [viewport, setViewport] = useState(() =>
    typeof window !== "undefined" && window.innerWidth < 768 ? 420 : 800
  );
  const fontSize = evalClamp(viewport);
  const pct = ((viewport - W_MIN) / (W_MAX - W_MIN)) * 100;

  return (
    <div className="bg-surface border border-border rounded-2xl p-5 md:p-8 text-left max-w-3xl mx-auto">
      {/* Preview text */}
      <div className="mb-8 min-h-[4rem] sm:min-h-[6rem] flex items-center overflow-hidden">
        <p
          style={{ fontSize: `min(${fontSize}px, 9vw + 1rem)`, lineHeight: 1.1 }}
          className="font-display font-bold text-text transition-all duration-75"
        >
          Fluid typography scales beautifully.
        </p>
      </div>

      {/* Slider */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-mono text-muted">
          <span>fw-text-[28px-72px]</span>
          <span className="text-accent">{viewport}px viewport</span>
        </div>

        <div className="relative">
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
        </div>

        <div className="flex items-center justify-between text-xs font-mono text-muted/60">
          <span>{W_MIN}px</span>
          <span>{W_MAX}px</span>
        </div>
      </div>

      {/* Generated CSS */}
      <div className="mt-6 pt-6 border-t border-border">
        <p className="text-xs font-mono text-muted mb-2">Generated CSS:</p>
        <code className="text-sm font-mono text-accent/90">{CLAMP_CSS}</code>
      </div>

      {/* Size indicator */}
      <div className="mt-4 flex items-center gap-2">
        <div className="h-px bg-border flex-1" />
        <span className="text-xs font-mono text-muted">
          {fontSize.toFixed(1)}px at this viewport
        </span>
        <div className="h-px bg-border flex-1" />
      </div>
    </div>
  );
}

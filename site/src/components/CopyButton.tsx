import { useState } from "react";

interface Props {
  text: string;
  label?: string;
  className?: string;
}

export function CopyButton({
  text,
  label = "Copy",
  className = "",
}: Props) {
  const [copied, setCopied] = useState(false);

  const fallbackCopy = (value: string) => {
    const ta = document.createElement("textarea");
    ta.value = value;
    ta.setAttribute("readonly", "");
    ta.style.position = "absolute";
    ta.style.left = "-9999px";

    document.body.appendChild(ta);
    ta.select();

    document.execCommand("copy");

    document.body.removeChild(ta);
  };

  const handleCopy = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(text);
      } else {
        fallbackCopy(text);
      }

      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      fallbackCopy(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={`inline-flex items-center gap-1.5 text-xs font-mono transition-colors ${
        copied
          ? "text-[#22d3ee]"
          : "text-[#8888a0] hover:text-[#f0f0f4]"
      } ${className}`}
      aria-label={copied ? "Copied!" : label}
    >
      {copied ? (
        <>
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
          {label ? "Copied" : ""}
        </>
      ) : (
        <>
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
          {label}
        </>
      )}
    </button>
  );
}

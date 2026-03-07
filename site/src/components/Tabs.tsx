import { useState } from "react";
import { CopyButton } from "./CopyButton";

interface TabItem {
  id: string;
  label: string;
  cmd: string;
}

interface TabsProps {
  tabs: TabItem[];
  defaultTabId?: string;
}

export function Tabs({ tabs, defaultTabId }: TabsProps) {
  const initialTab =
    tabs.find((t) => t.id === defaultTabId) ?? tabs[0];

  const [activeTab, setActiveTab] = useState(initialTab);

  return (
    <div className="border border-border rounded-xl overflow-hidden">
      <div className="flex border-b border-border bg-surface2/50 overflow-x-auto overflow-y-hidden">
        {tabs.map((tab) => {
          const isActive = activeTab.id === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-xs font-mono transition-colors ${
                isActive
                  ? "text-accent border-b-2 border-accent -mb-px"
                  : "text-muted hover:text-text"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-3 px-5 py-4 bg-surface2">
        <span className="text-muted font-mono text-sm select-none">
          $
        </span>
        <code className="font-mono text-sm text-text flex-1">
          {activeTab.cmd}
        </code>
        <CopyButton text={activeTab.cmd} />
      </div>
    </div>
  );
}

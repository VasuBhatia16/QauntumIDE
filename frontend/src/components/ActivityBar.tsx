import "../styles/ActivityBar.css";
import { useMemo } from "react";

type Props = {
  active: "explorer" | "search" | "settings" | null;
  onChange: (panel: "explorer" | "search" | "settings") => void;
};

export default function ActivityBar({ active, onChange }: Props) {
  // simple inline SVG icons to avoid extra deps
  const icons = useMemo(
    () => ({
      explorer: (
        <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden>
          <path d="M3 4h18v4H3zM3 10h10v10H3zM15 10h6v10h-6z" fill="currentColor" />
        </svg>
      ),
      search: (
        <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden>
          <path d="M10 18a8 8 0 1 1 5.293-14.293A8 8 0 0 1 10 18zm11 3-6-6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round"/>
        </svg>
      ),
      settings: (
        <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden>
          <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm8-3a1 1 0 0 0 .894-1.447l-1.05-2.101 1.414-1.414-2.121-2.121-1.414 1.414-2.101-1.05A1 1 0 0 0 14 3h-4a1 1 0 0 0-.922.631l-2.1 1.05L5.564 3.268 3.443 5.39l1.414 1.414-1.05 2.101A1 1 0 0 0 3 11v2a1 1 0 0 0 .631.922l1.05 2.1-1.414 1.415 2.121 2.121 1.414-1.414 2.1 1.05A1 1 0 0 0 10 21h4a1 1 0 0 0 .922-.632l2.101-1.05 1.414 1.414 2.121-2.121-1.414-1.414 1.05-2.1A1 1 0 0 0 21 13v-2z" fill="currentColor"/>
        </svg>
      ),
    }),
    []
  );

  return (
    <aside className="activitybar">
      {(["explorer", "search", "settings"] as const).map((key) => (
        <button
          key={key}
          className={`activitybar-btn ${active === key ? "active" : ""}`}
          onClick={() => onChange(key)}
          title={key[0].toUpperCase() + key.slice(1)}
          aria-pressed={active === key}
        >
          {icons[key]}
        </button>
      ))}
    </aside>
  );
}

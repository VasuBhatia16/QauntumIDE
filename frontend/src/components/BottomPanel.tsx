import "../styles/BottomPanel.css";
import { ReactNode, useState } from "react";

type Props = {
  terminal: ReactNode;
  problems: ReactNode;
};

export default function BottomPanel({ terminal, problems }: Props) {
  const [activeTab, setActiveTab] = useState<"terminal" | "problems">("terminal");

  return (
    <div className="bottom-panel">
      <div className="bottom-tabs">
        <button
          className={`bottom-tab ${activeTab === "terminal" ? "active" : ""}`}
          onClick={() => setActiveTab("terminal")}
        >
          Terminal
        </button>
        <button
          className={`bottom-tab ${activeTab === "problems" ? "active" : ""}`}
          onClick={() => setActiveTab("problems")}
        >
          Problems
        </button>
      </div>

      <div className="bottom-content">
        {activeTab === "terminal" ? terminal : problems}
      </div>
    </div>
  );
}

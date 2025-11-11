import "../styles/ProblemsPanel.css";
import type { FileNode } from "./Explorer";

type Problem = {
  file: FileNode;
  message: string;
  line?: number;
  column?: number;
};

type Props = {
  problems: Problem[];
};

export default function ProblemsPanel({ problems }: Props) {
  return (
    <div className="problems-panel">
      {!problems.length && (
        <div className="problems-empty">
          No problems detected.
        </div>
      )}

      {problems.length > 0 && (
        <ul className="problems-list">
          {problems.map((p, idx) => (
            <li key={idx} className="problem-row">
              <div className="problem-file">{p.file.name}</div>
              <div className="problem-msg">{p.message}</div>
              {(p.line || p.column) && (
                <div className="problem-loc">
                  {p.line}:{p.column}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

import "../styles/TerminalPanel.css";

type Props = {
  output: string;
  error: string;
  exitCode: number | null;
  onClear: () => void;
};

export default function TerminalPanel({ output, error, exitCode, onClear }: Props) {
  return (
    <div className="terminal-panel">
      <header className="terminal-header">
        <span className="terminal-title">Terminal</span>

        <button className="terminal-clear" onClick={onClear}>
          Clear
        </button>
      </header>

      <div className="terminal-body">
        {output && (
          <pre className="terminal-out">
            {output}
          </pre>
        )}

        {error && (
          <pre className="terminal-err">
            {error}
          </pre>
        )}

        {exitCode !== null && (
          <pre className="terminal-exit">
            Process exited with code {exitCode}
          </pre>
        )}

        {!output && !error && exitCode === null && (
          <div className="terminal-empty">No output</div>
        )}
      </div>
    </div>
  );
}

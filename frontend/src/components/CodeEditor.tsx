import { useEffect } from "react";
import Editor from "@monaco-editor/react";
import "../styles/CodeEditor.css";
import type { FileNode } from "./Explorer";

type Props = {
  file: FileNode | null;
  onChange: (updated: FileNode) => void;
};

export default function CodeEditor({ file, onChange }: Props) {
  // Determine language from extension
  const getLanguage = () => {
    if (!file) return "plaintext";
    const name = file.name.toLowerCase();

    if (name.endsWith(".py")) return "python";
    if (name.endsWith(".js") || name.endsWith(".jsx")) return "javascript";
    if (name.endsWith(".ts") || name.endsWith(".tsx")) return "typescript";
    if (name.endsWith(".cpp") || name.endsWith(".cc") || name.endsWith(".cxx")) return "cpp";
    if (name.endsWith(".java")) return "java";
    if (name.endsWith(".go")) return "go";
    if (name.endsWith(".json")) return "json";
    if (name.endsWith(".md")) return "markdown";

    return "plaintext";
  };

  // On mount, refresh editor layout
  useEffect(() => {
    window.dispatchEvent(new Event("resize"));
  }, [file?.id]);

  if (!file) {
    return (
      <div className="editor-empty">
        <h3>No file selected</h3>
        <p>Choose a file from Explorer</p>
      </div>
    );
  }

  return (
    <Editor
      height="100%"
      theme="vs-dark"
      language={getLanguage()}
      value={file.content || ""}
      onChange={(val) =>
        onChange({
          ...file,
          content: val || "",
        })
      }
      options={{
        automaticLayout: true,
        scrollBeyondLastLine: true,
        fontSize: 14,
        minimap: { enabled: false },
        padding: { top: 12 },
      }}
    />
  );
}

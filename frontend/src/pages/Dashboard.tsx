import "../styles/Dashboard.css";
import "../styles/ResizeGrip.css";
import Navbar from "../components/Navbar";
import ProtectedRoute from "../components/ProtectedRoute";
import ActivityBar from "../components/ActivityBar";
import Explorer from "../components/Explorer";
import type { FileNode } from "../components/Explorer";
import CodeEditor from "../components/CodeEditor";
import BottomPanel from "../components/BottomPanel";
import TerminalPanel from "../components/TerminalPanel";
import ProblemsPanel from "../components/ProblemsPanel";
import { useEffect, useMemo, useState, useRef } from "react";
import { useUser, useAuth } from "@clerk/clerk-react";

export default function Dashboard() {
  const { user } = useUser();
  const { getToken } = useAuth();

  const [activePanel, setActivePanel] = useState<
    "explorer" | "search" | "settings" | null
  >("explorer");

  const detectLanguage = (filename: string | undefined) => {
  if (!filename) return null;
  const ext = filename.split(".").pop();

  switch (ext) {
    case "py": return "python";
    case "js": return "javascript";
    case "cpp":
    case "cc":
    case "cxx": return "cpp";
    case "java": return "java";
    case "go": return "go";
    case "md": return "markdown";
    case "json": return "json";
    case "html": return "html";
    case "css": return "css";
    case "ts": return "typescript";
    default: return null;
  }
};


  const initialTree: FileNode[] = useMemo(
    () => [
      {
        id: crypto.randomUUID(),
        name: "src",
        type: "folder",
        children: [
          {
            id: crypto.randomUUID(),
            name: "main.py",
            type: "file",
            language: "python",
            content: 'print("Hello QuantumIDE")',
          },
          {
            id: crypto.randomUUID(),
            name: "app.js",
            type: "file",
            language: "javascript",
            content: "console.log('Hello')",
          },
        ],
      },
      {
        id: crypto.randomUUID(),
        name: "README.md",
        type: "file",
        language: "markdown",
        content: "# Project",
      },
    ],
    []
  );
  const runCode = async () => {
  if (!activeFile) return;

  const language = activeFile.language || detectLanguage(activeFile.name);  

  if (!language) {
    setError("Cannot detect language for this file.");
    return;
  }

  try {
    const token = await getToken();

    const res = await fetch(`${import.meta.env.VITE_API_URL}/execute`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        language: language,
        code: activeFile.content,
        filename: activeFile.name,
        timeout: 10
      }),
    });

    const data = await res.json();

    setOutput(data.stdout || "");
    setError(data.stderr || "");
    setExitCode(data.exitCode ?? null);
  } catch (err) {
    setError("Execution failed.");
  }
};

  const [tree, setTree] = useState<FileNode[]>(initialTree);
  const [activeFile, setActiveFile] = useState<FileNode | null>(null);

  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [exitCode, setExitCode] = useState<number | null>(null);
  const [problems] = useState([]);

  const [bottomHeight, setBottomHeight] = useState(220);
  const [isDragging, setIsDragging] = useState(false);
  const startYRef = useRef<number>(0);
  const startHeightRef = useRef<number>(0);

  const [apiResponse, setApiResponse] = useState("");
  console.log("API Response:", apiResponse);

  useEffect(() => {
    (async () => {
      try {
        const token = await getToken();
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/ping`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await res.json();
        setApiResponse(data?.message || "");
      } catch {
        setApiResponse("Backend unreachable");
      }
    })();
  }, []); 

  const onOpenFile = (node: FileNode) => setActiveFile(node);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    startYRef.current = e.clientY;
    startHeightRef.current = bottomHeight;
    document.body.style.cursor = "row-resize";
    document.body.style.userSelect = "none";
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    const dy = e.clientY - startYRef.current;
    const newHeight = Math.min(Math.max(startHeightRef.current - dy, 120), 500);
    setBottomHeight(newHeight);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    document.body.style.cursor = "";
    document.body.style.userSelect = "";
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  });

  return (
    <ProtectedRoute>
      <div className="dashboard-page">
        <Navbar />

        <div
          className={`ide-shell ${
            activePanel !== "explorer" ? "explorer-collapsed" : ""
          }`}
        >
          <ActivityBar
            active={activePanel}
            onChange={(p) => setActivePanel((curr) => (curr === p ? null : p))}
          />

          <Explorer
            collapsed={activePanel !== "explorer"}
            tree={tree}
            onOpenFile={onOpenFile}
            onUpdateTree={setTree}
          />

          <main className="editor-surface">
            <div className="editor-top">
              <div className="tabbar">
                {!activeFile && <div className="tab active">Welcome</div>}
                {activeFile && <div className="tab active">{activeFile.name}</div>}
              </div>

              <div className="editor-top-right">
                <button className="run-btn" onClick={runCode} disabled={!activeFile}>
                  ▶ Run
                </button>
                <div className="session-pill">
                  {user?.fullName || user?.username}
                </div>
              </div>
            </div>

            <section className="editor-area">
              <CodeEditor
                file={activeFile}
                onChange={(updated) => {
                  const updateTreeContent = (nodes: FileNode[]): FileNode[] =>
                    nodes.map((n) => {
                      if (n.id === updated.id) return updated;
                      if (n.children)
                        return { ...n, children: updateTreeContent(n.children) };
                      return n;
                    });

                  setTree(updateTreeContent(tree));
                  setActiveFile(updated);
                }}
              />
            </section>

            <div
              className={`resize-grip ${isDragging ? "dragging" : ""}`}
              onMouseDown={handleMouseDown}
            />

            <div style={{ height: bottomHeight }}>
              <BottomPanel
                terminal={
                  <TerminalPanel
                    output={output}
                    error={error}
                    exitCode={exitCode}
                    onClear={() => {
                      setOutput("");
                      setError("");
                      setExitCode(null);
                    }}
                  />
                }
                problems={<ProblemsPanel problems={problems} />}
              />
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}

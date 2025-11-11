import "../styles/Dashboard.css";
import Navbar from "../components/Navbar";
import ProtectedRoute from "../components/ProtectedRoute";
import ActivityBar from "../components/ActivityBar";
import Explorer from "../components/Explorer";
import type { FileNode } from "../components/Explorer";
import { useEffect, useMemo, useState } from "react";
import { useUser, useAuth } from "@clerk/clerk-react";
import CodeEditor from "../components/CodeEditor";

export default function Dashboard() {
  const { user } = useUser();
  const { getToken } = useAuth();

  // Activity bar state
  const [activePanel, setActivePanel] = useState<"explorer" | "search" | "settings" | null>("explorer");

  // Initial sample tree (local/in-memory)
  const initialTree: FileNode[] = useMemo(
    () => [
      {
        id: crypto.randomUUID(),
        name: "src",
        type: "folder",
        children: [
          { id: crypto.randomUUID(), name: "main.py", type: "file", language: "python", content: 'print("Hello QuantumIDE")' },
          { id: crypto.randomUUID(), name: "app.js", type: "file", language: "javascript", content: "console.log('Hello')" },
        ],
      },
      { id: crypto.randomUUID(), name: "README.md", type: "file", language: "markdown", content: "# Project" },
    ],
    []
  );
  const [tree, setTree] = useState<FileNode[]>(initialTree);

  // Active file
  const [activeFile, setActiveFile] = useState<FileNode | null>(null);

  // Backend ping (optional test)
  const [apiResponse, setApiResponse] = useState("");
  useEffect(() => {
    (async () => {
      try {
        const token = await getToken();
        const res = await fetch(`http://localhost:8000/secure/ping`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setApiResponse(data?.message || "");
      } catch {
        setApiResponse("Backend unreachable");
      }
    })();
  }, [getToken]);

  const onOpenFile = (node: FileNode) => setActiveFile(node);

  return (
    <ProtectedRoute>
      <div className="dashboard-page">
        <Navbar />

        <div className="ide-shell">
          <ActivityBar active={activePanel} onChange={(p) => setActivePanel((curr) => (curr === p ? null : p))} />

          {/* Explorer collapses when not active */}
          <Explorer
            collapsed={activePanel !== "explorer"}
            tree={tree}
            onOpenFile={onOpenFile}
            onUpdateTree={setTree}
          />

          {/* Editor placeholder (Monaco arrives in Phase 2.2) */}
                    <main className="editor-surface">
            <div className="editor-top">
              <div className="tabbar">
                {!activeFile && <div className="tab active">Welcome</div>}
                {activeFile && (
                  <div className="tab active">{activeFile.name}</div>
                )}
              </div>

              <div className="session-pill">
                Signed in as {user?.fullName || user?.username}
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
          </main>

        </div>
      </div>
    </ProtectedRoute>
  );
}

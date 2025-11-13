import "../styles/Explorer.css";
import { useState } from "react";

export type FileNode = {
  id: string;
  name: string;
  type: "file" | "folder";
  language?: string;
  content?: string;
  children?: FileNode[];
};

type Props = {
  tree: FileNode[];
  onOpenFile: (node: FileNode) => void;
  onUpdateTree: (next: FileNode[]) => void;
  collapsed: boolean;
};

export default function Explorer({ tree, onOpenFile, onUpdateTree, collapsed }: Props) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const toggle = (id: string) =>
    setExpanded((e) => ({ ...e, [id]: !e[id] }));

  const addFile = (parentId?: string) => {
    const name = prompt("New file name (e.g., main.py):");
    if (!name) return;

    const newNode: FileNode = {
      id: crypto.randomUUID(),
      name,
      type: "file",
      content: "",
    };

    const insert = (nodes: FileNode[]): FileNode[] =>
      nodes.map((n) => {
        if (parentId && n.id === parentId && n.type === "folder") {
          return { ...n, children: [...(n.children || []), newNode] };
        }
        if (n.children) return { ...n, children: insert(n.children) };
        return n;
      });

    if (!parentId) onUpdateTree([...tree, newNode]);
    else onUpdateTree(insert(tree));
  };

  const addFolder = (parentId?: string) => {
    const name = prompt("New folder name:");
    if (!name) return;

    const newNode: FileNode = {
      id: crypto.randomUUID(),
      name,
      type: "folder",
      children: [],
    };

    const insert = (nodes: FileNode[]): FileNode[] =>
      nodes.map((n) => {
        if (parentId && n.id === parentId && n.type === "folder") {
          return { ...n, children: [...(n.children || []), newNode] };
        }
        if (n.children) return { ...n, children: insert(n.children) };
        return n;
      });

    if (!parentId) onUpdateTree([...tree, newNode]);
    else onUpdateTree(insert(tree));
  };

  const renameNode = (id: string) => {
    const name = prompt("Rename to:");
    if (!name) return;

    const mutate = (nodes: FileNode[]): FileNode[] =>
      nodes.map((n) =>
        n.id === id ? { ...n, name } : { ...n, children: n.children ? mutate(n.children) : undefined }
      );

    onUpdateTree(mutate(tree));
  };

  const deleteNode = (id: string) => {
    const confirmDel = confirm("Delete this item?");
    if (!confirmDel) return;

    const filter = (nodes: FileNode[]): FileNode[] =>
      nodes
        .filter((n) => n.id !== id)
        .map((n) => ({ ...n, children: n.children ? filter(n.children) : undefined }));

    onUpdateTree(filter(tree));
  };

  const Row = ({ node, depth = 0 }: { node: FileNode; depth?: number }) => {
    const isFolder = node.type === "folder";
    const isOpen = !!expanded[node.id];

    return (
      <div>
        <div
          className={`explorer-row ${isFolder ? "folder" : "file"}`}
          style={{ paddingLeft: 10 + depth * 14 }}
          onDoubleClick={() => (isFolder ? toggle(node.id) : onOpenFile(node))}
        >
          <div className="explorer-row-left" onClick={() => isFolder && toggle(node.id)}>
            <span className={`chev ${isFolder ? (isOpen ? "open" : "") : "invisible"}`}>▸</span>
            <span className={`kind ${isFolder ? "k-folder" : "k-file"}`} />
            <span className="name" title={node.name}>{node.name}</span>
          </div>

          <div className="row-actions">
            {isFolder ? (
              <>
                <button className="row-btn" onClick={() => addFile(node.id)}>＋f</button>
                <button className="row-btn" onClick={() => addFolder(node.id)}>＋d</button>
              </>
            ) : null}
            <button className="row-btn" onClick={() => renameNode(node.id)}>✎</button>
            <button className="row-btn danger" onClick={() => deleteNode(node.id)}>⌫</button>
          </div>
        </div>

        {isFolder && isOpen && node.children && node.children.length > 0 && (
          <div className="children">
            {node.children.map((c) => (
              <Row key={c.id} node={c} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <aside className={`explorer ${collapsed ? "hidden" : ""}`}>
      {!collapsed && (
        <>
          <header className="explorer-header">
            <span className="explorer-title">EXPLORER</span>
            <div className="explorer-actions">
              <button className="ex-btn" onClick={() => addFile()}>＋f</button>
              <button className="ex-btn" onClick={() => addFolder()}>＋d</button>
            </div>
          </header>

          <div className="explorer-tree">
            {tree.length === 0 ? (
              <div className="empty">No files yet.</div>
            ) : (
              tree.map((n) => <Row key={n.id} node={n} />)
            )}
          </div>
        </>
      )}
    </aside>
  );
}

export interface FileNode {
  name: string;
  type: "file" | "dir";
  size?: number;
  ext?: string;
  children?: FileNode[];
}

export function countFiles(node: FileNode | null): number {
  if (!node) return 0;
  if (node.type === "file") return 1;
  let c = 0;
  node.children?.forEach((x) => (c += countFiles(x)));
  return c;
}

export function getTotalSize(node: FileNode | null): number {
  if (!node) return 0;
  if (node.type === "file") return node.size || 0;
  let t = 0;
  node.children?.forEach((x) => (t += getTotalSize(x)));
  return t;
}

export function formatSize(b: number): string {
  if (b < 1024) return b + " B";
  if (b < 1048576) return (b / 1024).toFixed(1) + " KB";
  return (b / 1048576).toFixed(1) + " MB";
}

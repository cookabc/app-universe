import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { ReactNode } from "react";

interface Props {
  content: string;
}

function textFromNode(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textFromNode).join("");
  if (node && typeof node === "object" && "props" in node) {
    const props = node.props as { children?: ReactNode };
    return textFromNode(props.children);
  }
  return "";
}

export function slugHeading(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export default function MarkdownRenderer({ content }: Props) {
  return (
    <div className="md-content" style={{ textAlign: "left", maxWidth: "65ch", margin: "0 auto" }}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h2({ children }) {
            const id = slugHeading(textFromNode(children));
            return <h2 id={id}>{children}</h2>;
          },
          h3({ children }) {
            const id = slugHeading(textFromNode(children));
            return <h3 id={id}>{children}</h3>;
          },
        }}
      >
        {content}
      </ReactMarkdown>
      <style>{`.md-content{font-family:var(--font-sans);max-width:65ch;margin:0 auto}.md-content h1{font-family:var(--font-display);font-size:22px;font-weight:500;margin:28px 0 14px;color:var(--text-primary);line-height:1.2;text-wrap:balance}.md-content h2{font-family:var(--font-display);font-size:21px;font-weight:500;margin:32px 0 14px;color:var(--text-primary);border-bottom:1px solid var(--border-soft);padding-bottom:8px;line-height:1.25;text-wrap:balance;scroll-margin-top:96px}.md-content h3{font-family:var(--font-display);font-size:16px;font-weight:500;margin:22px 0 10px;color:var(--brand);line-height:1.3;scroll-margin-top:96px}.md-content p{margin:12px 0;line-height:1.68;color:var(--text-secondary);font-size:14px;text-wrap:pretty}.md-content ul,.md-content ol{margin:12px 0;padding-left:20px;color:var(--text-secondary)}.md-content li{margin:6px 0;line-height:1.6}.md-content code:not(pre code){background:var(--bg-secondary);padding:2px 6px;border-radius:3px;font-family:var(--font-mono);font-size:12px;color:var(--brand);font-weight:500}.md-content pre{background:var(--bg-card);border-radius:var(--radius-sm);padding:14px;overflow-x:auto;margin:16px 0;border:1px solid var(--border-soft)}.md-content pre code{background:none;padding:0;font-family:var(--font-mono);font-size:12px;color:var(--text-primary);line-height:1.6;font-variant-numeric:tabular-nums}.md-content blockquote{padding:10px 16px;margin:16px 0;color:var(--text-secondary);background:var(--bg-card);border-radius:var(--radius-sm);border-top:1px solid var(--border-soft);border-bottom:1px solid var(--border-soft)}.md-content table{width:100%;border-collapse:collapse;margin:16px 0;font-size:13px}.md-content th,.md-content td{border:1px solid var(--border-soft);padding:8px 12px;text-align:left}.md-content th{background:var(--bg-secondary);font-weight:600;color:var(--text-primary)}.md-content td{color:var(--text-secondary)}.md-content strong{color:var(--text-primary);font-weight:600}.md-content a{color:var(--brand);text-decoration:underline;text-underline-offset:2px}.md-content hr{border:none;border-top:1px solid var(--border-soft);margin:28px 0}.md-content img{max-width:100%;border-radius:var(--radius-sm);border:1px solid rgba(255,255,255,.1)}`}</style>
    </div>
  );
}

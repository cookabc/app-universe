import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface CodeExample {
  language: string;
  code: string;
  title?: string;
  description?: string;
}

interface Props {
  examples: CodeExample[];
  title?: string;
}

export default function CodePlayground({ examples, title = "Live Examples" }: Props) {
  const [ei, setEi] = useState(0);
  const [copied, setCopied] = useState(false);
  if (!examples.length) return null;
  const ex = examples[ei];

  const handleCopy = () => {
    navigator.clipboard.writeText(ex.code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <Card className="max-w-[65ch] mx-auto overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between gap-4 pb-3">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-sm font-semibold text-foreground">
            {title}
          </span>
          <div className="flex gap-1">
            {examples.map((e, i) => (
              <Button
                key={i}
                onClick={() => setEi(i)}
                role="tab"
                aria-selected={i === ei}
                variant={i === ei ? "default" : "ghost"}
                size="sm"
                className="text-xs font-mono"
              >
                {e.language?.toLowerCase()}
              </Button>
            ))}
          </div>
        </div>
        <Button
          onClick={handleCopy}
          aria-label="Copy code"
          variant={copied ? "default" : "ghost"}
          size="sm"
          className="text-xs font-mono"
        >
          {copied ? "Copied" : "Copy"}
        </Button>
      </CardHeader>
      {ex.description && (
        <div className="px-4 py-2 text-sm text-muted-foreground border-b border-border">
          {ex.description}
        </div>
      )}
      <CardContent className="p-0">
        <div
          className="code-playground p-5 text-sm font-mono leading-relaxed whitespace-pre-wrap break-words text-foreground overflow-x-auto text-left"
        >
          <code>{ex.code}</code>
        </div>
      </CardContent>
    </Card>
  );
}

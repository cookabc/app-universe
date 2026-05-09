"use client";

import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import type { SkillData } from "../../data/skills";
import { extractCodeBlocks } from "../../utils/markdownParser";
import MarkdownRenderer from "../common/MarkdownRenderer";

interface Props {
  skill: SkillData;
}

export default function ContentTabs({ skill }: Props) {
  return (
    <div className="mb-8 max-w-3xl mx-auto">
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="doc">Full Doc</TabsTrigger>
          <TabsTrigger value="examples">Code Examples</TabsTrigger>
          <TabsTrigger value="files">Files</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Overview skill={skill} />
        </TabsContent>
        <TabsContent value="doc">
          <div className="text-left">
            <h2 className="text-2xl font-bold tracking-tight text-foreground mb-3">
              {skill.name}
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              {skill.description}
            </p>
            <MarkdownRenderer content={skill.content} />
          </div>
        </TabsContent>
        <TabsContent value="examples">
          <Examples skill={skill} />
        </TabsContent>
        <TabsContent value="files">
          <Files skill={skill} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Overview({ skill }: Props) {
  return (
    <div className="py-2">
      <h3 className="text-lg font-bold text-foreground mb-4">What is this?</h3>
      <p className="text-sm text-muted-foreground leading-relaxed mb-6">
        {skill.description || "No description provided."}
      </p>
      {skill.keyFeatures.length > 0 && (
        <>
          <h3 className="text-base font-semibold text-primary mb-3">
            Key Features
          </h3>
          <ul className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-2 mb-6">
            {skill.keyFeatures.map((f, i) => (
              <li
                key={i}
                className="p-3 rounded-lg bg-muted border border-border text-[13px] text-muted-foreground leading-snug"
              >
                {f}
              </li>
            ))}
          </ul>
        </>
      )}
      {skill.useCases.length > 0 && (
        <>
          <h3 className="text-base font-semibold text-primary mb-3">
            Use Cases
          </h3>
          <div className="flex flex-col gap-2 mb-6">
            {skill.useCases.map((uc, i) => (
              <div
                key={i}
                className="flex items-baseline gap-3 p-3 rounded-lg bg-muted border border-border"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-1.5" />
                <div>
                  <div className="font-semibold text-[13px] text-foreground">
                    {uc.title}
                  </div>
                  {uc.description !== uc.title && (
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {uc.description}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function Examples({ skill }: Props) {
  const blocks = extractCodeBlocks(skill.content);
  return (
    <div>
      <p className="text-sm text-muted-foreground mb-4">
        Found {blocks.length} code example{blocks.length !== 1 ? "s" : ""}
      </p>
      {blocks.map((b, i) => (
        <div
          key={i}
          className="mb-4 rounded-lg bg-card border border-border overflow-hidden"
        >
          <div className="px-4 py-2 bg-muted text-[11px] font-mono text-muted-foreground flex justify-between items-center">
            <span>{b.language || "code"}</span>
            <span>#{i + 1}</span>
          </div>
          <pre className="m-0 p-4 overflow-x-auto text-xs font-mono leading-relaxed tabular-nums">
            <code>{b.code}</code>
          </pre>
        </div>
      ))}
    </div>
  );
}

function Files({ skill }: Props) {
  const tree = skill.fileInfo.tree;

  function FileNode({ node, depth }: { node: any; depth: number }) {
    const [open, setOpen] = useState(depth < 1);

    if (node.type === "dir")
      return (
        <div>
          <button
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            className="flex items-center gap-1.5 py-0.5 text-foreground cursor-pointer text-xs font-mono w-full text-left"
            style={{ paddingLeft: `${depth * 16}px` }}
          >
            <span className="text-muted-foreground">{open ? "▾" : "▸"}</span>
            <span>{node.name}/</span>
          </button>
          {open &&
            node.children?.map((c: any, j: number) => (
              <FileNode key={j} node={c} depth={depth + 1} />
            ))}
        </div>
      );

    return (
      <div
        className="flex items-center gap-1.5 py-0.5 text-xs font-mono text-muted-foreground"
        style={{ paddingLeft: `${depth * 16}px` }}
      >
        <span className="invisible w-2.5">&#x25B8;</span>
        <span>{node.name}</span>
        {node.size != null ? (
          <span className="ml-auto text-muted-foreground tabular-nums text-[11px]">
            {(node.size / 1024).toFixed(1)}KB
          </span>
        ) : null}
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-card border border-border p-4 font-mono text-xs">
      <div className="mb-2.5 font-semibold text-primary text-xs">
        {tree?.name || skill.id}/
      </div>
      {tree?.children?.map((c: any, i: number) => (
        <FileNode key={i} node={c} depth={0} />
      )) || <div className="text-muted-foreground">No files found</div>}
    </div>
  );
}
